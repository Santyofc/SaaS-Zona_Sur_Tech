import { Zap, Shield, CheckCircle2, Globe } from "lucide-react";
import Link from "next/link";
import { GlitchText } from "@/components/ui/GlitchText.client";
import { PriceCalculator } from "./components/PriceCalculator";

import { getPublishedEntryBySlug } from "@/lib/cms/queries";
import { Metadata } from "next";

const DEFAULT_METADATA = {
    title: "Servicios y Planes | Business OS e IA | ZonaSur Tech",
    description: "Servicios para diagnosticar, diseñar e implementar su Business OS. Automatización e IA aplicada para empresas en Costa Rica.",
    alternates: {
        canonical: "https://zonasurtech.online/pricing",
    },
    openGraph: {
        title: "Servicios y Planes | ZonaSur Tech Business OS",
        description: "Diagnóstico, implementación y evolución continua de su Business OS.",
        url: "https://zonasurtech.online/pricing",
    },
};

export async function generateMetadata(): Promise<Metadata> {
    try {
        const entry = await getPublishedEntryBySlug("pricing", "page");
        if (!entry) return DEFAULT_METADATA;

        const seo = (entry.seoMeta ?? {}) as { title?: string; description?: string; ogImage?: string; noindex?: boolean };
        
        return {
            title: seo.title || entry.title || DEFAULT_METADATA.title || undefined,
            description: seo.description || entry.excerpt || DEFAULT_METADATA.description || undefined,
            alternates: DEFAULT_METADATA.alternates,
            openGraph: {
                ...DEFAULT_METADATA.openGraph,
                title: seo.title || entry.title || DEFAULT_METADATA.openGraph?.title || undefined,
                description: seo.description || entry.excerpt || DEFAULT_METADATA.openGraph?.description || undefined,
                images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
            },
            robots: seo.noindex ? { index: false, follow: false } : undefined,
        };
    } catch {
        return DEFAULT_METADATA;
    }
}

const plans = [
    {
        name: "Diagnostico Operativo",
        price: "$450",
        description: "Punto de partida para entender su operación actual y priorizar qué ordenar, automatizar o rediseñar.",
        features: ["Diagnóstico operativo", "Mapa de procesos", "Lista de fricciones", "Roadmap de quick wins"],
        cta: "Solicitar diagnóstico",
        color: "zs-blue"
    },
    {
        name: "Business OS Sprint",
        price: "$1,500",
        description: "Implementación guiada para estructurar procesos, automatizar tareas críticas y dejar un sistema operando.",
        features: ["Diseño del Business OS", "Automatizaciones clave", "Tablero de control", "Acompañamiento del equipo", "Entrega documentada"],
        cta: "Agendar sprint",
        highlight: true,
        color: "zs-violet"
    },
    {
        name: "AI Ops Layer",
        price: "Custom",
        description: "Para equipos que ya operan con base sólida y quieren sumar asistentes, búsqueda interna o ejecución asistida con IA.",
        features: ["Casos de uso IA", "Integración con su contexto", "Gobierno y seguridad", "Iteración continua", "Capacitación interna"],
        cta: "Diseñar capa IA",
        color: "zs-cyan"
    }
];

export default async function PricingPage() {
    // Hybrid CMS Pattern: we attempt to load the 'pricing' page entry to grab overrides
    const entry = await getPublishedEntryBySlug("pricing", "page").catch(() => null);
    
    // Fallbacks
    const pageTitle = entry?.title ?? "Formas de trabajar";
    const pageSubtitle = entry?.excerpt ?? "Desde un diagnóstico inicial hasta la implementación de automatización e IA. Elegimos el nivel de intervención según su momento operativo.";
    
    // We try to parse plans from the 'content' raw JSON block if the admin provided it, 
    // otherwise fallback to hardcoded default plans.
    let displayPlans = plans;
    try {
        if (entry?.content && typeof entry.content === 'object' && 'raw' in entry.content && entry.content.raw) {
            const parsedPlans = JSON.parse(entry.content.raw as string) as any[];
            if (Array.isArray(parsedPlans) && parsedPlans.length > 0) {
                displayPlans = parsedPlans;
            }
        }
    } catch {
        // Safe fallback; if the JSON mapping is incorrect or empty, we use the default hardcoded components
    }
    return (
        <main className="min-h-screen bg-zs-bg-primary pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
                    style={{ backgroundImage: 'radial-gradient(var(--color-zs-blue) 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                />
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-zs-blue/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-zs-violet/5 rounded-full blur-[130px]" />
            </div>

            <div className="container mx-auto relative z-10 text-center">
                <div className="max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-8">
                        <Zap className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Servicios de transformacion operativa</span>
                    </div>

                    <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-8">
                        {pageTitle.split(' ')[0]} <br />
                        <GlitchText 
                            text={pageTitle.split(' ').slice(1).join(' ') || "Estratégico"} 
                            className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                        />
                    </h1>

                    <p className="text-xl text-zs-text-secondary font-light leading-relaxed whitespace-pre-line">
                        {pageSubtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {displayPlans.map((plan: any, i: number) => (
                        <div key={i} className={`zs-card p-10 flex flex-col items-start text-left relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 ${plan.highlight ? 'bg-zs-bg-secondary/60 border-zs-blue/30 shadow-zs-glow-blue/10' : 'bg-zs-bg-secondary/40 border-zs-border'}`}>
                            {plan.highlight && (
                                <div className="absolute top-0 right-0 p-4">
                                    <div className="bg-zs-blue text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse shadow-zs-glow-blue">MÁS POPULAR</div>
                                </div>
                            )}

                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-5xl font-black text-white italic">{plan.price}</span>
                                {plan.price !== "Gratis" && plan.price !== "Custom" && <span className="text-zs-text-muted text-sm font-bold uppercase">/mes</span>}
                            </div>
                            
                            <p className="text-sm text-zs-text-secondary mb-10 leading-relaxed min-h-[3rem]">
                                {plan.description}
                            </p>

                            <div className="space-y-4 mb-12 w-full">
                                {plan.features.map((feat: any, j: number) => (
                                    <div key={j} className="flex items-center gap-3 group/item">
                                        <CheckCircle2 className={`w-4 h-4 ${plan.highlight ? 'text-zs-blue' : 'text-zs-text-muted'} group-hover/item:scale-125 transition-transform`} />
                                        <span className="text-xs font-bold text-zs-text-secondary uppercase tracking-tight">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${plan.highlight ? 'zs-btn-brand shadow-zs-glow-blue/20' : 'bg-zs-bg-primary border border-zs-border text-white hover:border-white/20'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                <PriceCalculator />

                <div className="mt-24 p-8 zs-card bg-black/40 border-zs-border flex flex-col md:flex-row items-center justify-center gap-12 max-w-4xl mx-auto">
                    <div className="flex items-center gap-6">
                        <Shield className="w-10 h-10 text-zs-blue opacity-50" />
                        <div className="text-left">
                            <h4 className="text-white font-black uppercase italic tracking-tight">Diseño con criterio</h4>
                            <p className="text-xs text-zs-text-muted">Cada propuesta parte de procesos reales, no de plantillas genéricas.</p>
                        </div>
                    </div>
                    <div className="h-px w-full md:w-px md:h-12 bg-zs-border" />
                    <div className="flex items-center gap-6">
                        <Globe className="w-10 h-10 text-zs-violet opacity-50" />
                        <div className="text-left">
                            <h4 className="text-white font-black uppercase italic tracking-tight">Implementación gradual</h4>
                            <p className="text-xs text-zs-text-muted">Ordenamos primero lo crítico y escalamos con evidencia, no con promesas.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
