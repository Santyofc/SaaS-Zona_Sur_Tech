"use client";
/**
 * LiveEmulators — Client Component
 *
 * Contains all the heavy client-only logic:
 * - Demo step animation (setTimeout loop)
 * - IDEEmulator + DeviceEmulator (dynamically imported)
 * - Intersection Observer: the loop only starts when this section is in view
 *
 * Key improvements vs the old page.tsx:
 * 1. Three separate useState calls → one useReducer (eliminates triple re-renders)
 * 2. rAF loop replaced by setTimeout (simpler, no need for 60fps here)
 * 3. IO guard: demo doesn't start until the section enters the viewport
 * 4. clearTimeout properly called on cleanup
 */
import { useEffect, useReducer, useRef } from "react";
import dynamic from "next/dynamic";

// ---------------------------------------------------------------------------
// Heavy components — deferred until the section enters the viewport
// ---------------------------------------------------------------------------
const IDEEmulator = dynamic(
  () => import("@repo/ui-experiments").then((m) => ({ default: m.IDEEmulator })),
  { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-zs-bg-secondary/50 rounded-[2rem]" /> }
);

const DeviceEmulator = dynamic(
  () => import("@repo/ui-experiments").then((m) => ({ default: m.DeviceEmulator })),
  { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-zs-bg-secondary/50 rounded-[2rem]" /> }
);

// ---------------------------------------------------------------------------
// Demo step data (static — defined outside component to avoid recreation)
// ---------------------------------------------------------------------------
const INITIAL_CODE = `import { KernelSync, LogStream } from '@zonasur/core';
import { TelemetryProvider } from '@core/metrics';

// ==========================================
// 🛡️ NUCLEUS CORE CONFIGURATION
// ==========================================
// Modify values below to observe real-time
// synchronization across deployed shards.

export const systemConfig = {
  // ⚡ Global Performance Tuning
  latency: "12ms",
  activeNodes: 64,

  // 🌐 Telemetry & Threat Assessment
  connections: "1.2M",
  threatLevel: "0.0%",
};

export default function KernelInitializer() {
  const syncEngine = new KernelSync(systemConfig);
  
  syncEngine.on('threatDetected', (event) => {
    LogStream.alert(\`Intrusion on node \${event.nodeId}\`);
  });

  return (
    <TelemetryProvider config={systemConfig}>
      <AppRouter />
    </TelemetryProvider>
  );
}`;

const DEMO_STEPS = [
  { author: "Santy", line: 11, target: 'latency: "12ms",', replacement: 'latency: "8ms",' },
  { author: "Elena", line: 12, target: "activeNodes: 64,", replacement: "activeNodes: 128," },
  { author: "Santy", line: 15, target: 'connections: "1.2M",', replacement: 'connections: "2.4M",' },
  { author: "Elena", line: 16, target: 'threatLevel: "0.0%",', replacement: 'threatLevel: "100%",' },
  { author: "Santy", line: 11, target: 'latency: "8ms",', replacement: 'latency: "4ms",' },
  { author: "Elena", line: 12, target: "activeNodes: 128,", replacement: "activeNodes: 256," },
] as const;

// ---------------------------------------------------------------------------
// State — consolidated into useReducer to avoid triple render per step
// ---------------------------------------------------------------------------
interface DemoState {
  code: string;
  activeLines: Record<string, number[]>;
  stepIndex: number;
}

type DemoAction =
  | { type: "STEP"; author: string; line: number; target: string; replacement: string; stepIndex: number }
  | { type: "MANUAL_UPDATE"; code: string }
  | { type: "RESET" };

function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "STEP":
      return {
        code: state.code.replace(action.target, action.replacement),
        activeLines: { ...state.activeLines, [action.author]: [action.line] },
        stepIndex: action.stepIndex,
      };
    case "MANUAL_UPDATE":
      return {
        ...state,
        code: action.code,
        activeLines: {}, // Clear active lines when user takes over
      };
    case "RESET":
      return { code: INITIAL_CODE, activeLines: {}, stepIndex: 0 };
  }
}

// ---------------------------------------------------------------------------
// Helpers — parse metrics from the current code string
// ---------------------------------------------------------------------------
function parseMetrics(code: string) {
  // Relaxed regex to catch values even if the user deletes quotes or commas
  const latencyMatch = code.match(/latency:\s*["']?(\d+)/i);
  const nodesMatch = code.match(/activeNodes:\s*["']?(\d+)/i);
  const connMatch = code.match(/connections:\s*["']?([\d.]+M?)/i);
  const threatMatch = code.match(/threatLevel:\s*["']?([\d.]+%?)/i);

  return {
    latency: latencyMatch ? `${latencyMatch[1]}ms` : "12ms",
    nodes: nodesMatch ? parseInt(nodesMatch[1], 10) : 64,
    connections: connMatch ? connMatch[1] : "1.2M",
    threats: threatMatch ? (threatMatch[1].includes('%') ? threatMatch[1] : `${threatMatch[1]}%`) : "0.0%",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LiveEmulators() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(false);
  const userInteractedRef = useRef(false);

  const [state, dispatch] = useReducer(demoReducer, {
    code: INITIAL_CODE,
    activeLines: {},
    stepIndex: 0,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function runStep() {
      if (!isVisibleRef.current || userInteractedRef.current) return;

      if (stepRef.current < DEMO_STEPS.length) {
        const step = DEMO_STEPS[stepRef.current];
        dispatch({
          type: "STEP",
          author: step.author,
          line: step.line,
          target: step.target,
          replacement: step.replacement,
          stepIndex: stepRef.current,
        });
        stepRef.current++;
        timeoutRef.current = setTimeout(runStep, 2000 + Math.random() * 1500);
      } else {
        // Hold at end, then reset
        timeoutRef.current = setTimeout(() => {
          stepRef.current = 0;
          dispatch({ type: "RESET" });
          timeoutRef.current = setTimeout(runStep, 500);
        }, 8000);
      }
    }

    // IO guard — only start the loop when section enters the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && stepRef.current === 0) {
          timeoutRef.current = setTimeout(runStep, 3000);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleIDEChange = (newCode: string) => {
    userInteractedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch({ type: "MANUAL_UPDATE", code: newCode });
  };

  const handleInteract = () => {
    userInteractedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const metrics = parseMetrics(state.code);

  return (
    <section ref={sectionRef} className="py-32 relative z-10 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-4">
            Ecosistema{" "}
            <span className="text-zs-blue drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Full-Stack
            </span>
          </h2>
          <p className="text-zs-text-secondary max-w-2xl mx-auto">
            Desde la escritura de código colaborativa en tiempo real hasta la
            previsualización instantánea multi-dispositivo. La herramienta
            definitiva para arquitectos de software.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">
          {/* IDE Emulator */}
          <div className="flex flex-col h-[900px] w-full relative group perspective-[2000px]">
            <div className="absolute -inset-4 bg-gradient-to-r from-zs-cyan/20 to-zs-blue/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-[2rem]" />
            <div className="flex-1 relative z-10 transition-transform duration-700 ease-out group-hover:rotate-y-[1deg] group-hover:scale-[1.01] rounded-[2rem] overflow-hidden border border-zs-border/50 bg-zs-bg-primary">
              <div className="absolute inset-0">
                <IDEEmulator code={state.code} activeLines={state.activeLines} onChange={handleIDEChange} onInteract={handleInteract} />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 shrink-0">
                Entorno Colaborativo
              </h3>
              <p className="text-xs text-zs-text-muted shrink-0">
                Presencia en tiempo real, cursores compartidos y terminal de build sincronizada.
              </p>
            </div>
          </div>

          {/* Device Emulator */}
          <div className="flex flex-col h-[900px] w-full relative group perspective-[2000px]">
            <div className="absolute -inset-4 bg-gradient-to-l from-zs-violet/20 to-zs-blue/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-[2rem]" />
            <div className="flex-1 relative z-10 transition-transform duration-700 ease-out group-hover:-rotate-y-[1deg] group-hover:scale-[1.01] rounded-[2rem] overflow-hidden border border-zs-border/50 bg-zs-bg-primary">
              <div className="absolute inset-0">
                <DeviceEmulator currentStep={state.stepIndex} metrics={metrics} />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 shrink-0">
                Previsualización Real
              </h3>
              <p className="text-xs text-zs-text-muted shrink-0">
                Hardware shell interactivo en 4K. De Desktop a Mobile con zero latencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
