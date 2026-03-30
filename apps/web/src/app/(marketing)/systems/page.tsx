import React from "react";
import { NeuralNetworkMap } from "@/components/Systems/SystemMap";
import { Terminal, Shield, Activity, Globe } from "lucide-react";
import Link from "next/link";

import { getPublishedEntryBySlug } from "@/lib/cms/queries";
import { Metadata } from "next";

const DEFAULT_METADATA: Metadata = {
    title: "Sistemas Core | Zona Sur Tech",
    description: "Visualización en tiempo real de la infraestructura global de Zona Sur Tech.",
};

export async function generateMetadata(): Promise<Metadata> {
    try {
        const entry = await getPublishedEntryBySlug("systems", "page");
        if (!entry) return DEFAULT_METADATA;

        const seo = (entry.seoMeta ?? {}) as { title?: string; description?: string; ogImage?: string; noindex?: boolean };
        return {
            title: seo.title || entry.title || DEFAULT_METADATA.title || undefined,
            description: seo.description || entry.excerpt || DEFAULT_METADATA.description || undefined,
            openGraph: {
                title: seo.title || entry.title || DEFAULT_METADATA.title || undefined,
                description: seo.description || entry.excerpt || DEFAULT_METADATA.description || undefined,
                images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
            },
            robots: seo.noindex ? { index: false, follow: false } : undefined,
        };
    } catch {
        return DEFAULT_METADATA;
    }
}

export default async function SystemsPage() {
    const entry = await getPublishedEntryBySlug("systems", "page").catch(() => null);
    
    // Core Overrides
    const pageTitle = (entry?.title as string | undefined | null) ?? "Arquitectura Distribuida";
    const pageSubtitle = entry?.excerpt ?? "Nuestros nodos operan en una malla neural de baja latencia, garantizando consistencia atómica y seguridad de grado militar en cada transacción.";
    return (
        <main className="min-h-screen bg-zs-bg-primary pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-zs-blue/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-zs-violet/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="max-w-4xl mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-blue/10 border border-zs-blue/20 text-zs-blue mb-8">
                        <Activity className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Live Network Telemetry</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-8">
                        {pageTitle.split(' ')[0]} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zs-cyan via-zs-blue to-zs-violet drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                            {pageTitle.split(' ').slice(1).join(' ') || "Distribuida"}
                        </span>
                    </h1>

                    <p className="text-xl text-zs-text-secondary font-light max-w-2xl leading-relaxed whitespace-pre-line">
                        {pageSubtitle}
                    </p>
                </div>

                {/* The Map */}
                <div className="mb-20">
                    <NeuralNetworkMap />
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl">
                    <MetricBox
                        icon={<Globe className="w-5 h-5" />}
                        label="Cobertura Global"
                        value="64 Nodos"
                        trend="100% Online"
                        color="cyan"
                    />
                    <MetricBox
                        icon={<Shield className="w-5 h-5" />}
                        label="Protocolo de Seguridad"
                        value="AES-GCM-256"
                        trend="E2EE Active"
                        color="emerald"
                    />
                    <MetricBox
                        icon={<Activity className="w-5 h-5" />}
                        label="Uptime"
                        value="99.999%"
                        trend="Zero Outage"
                        color="blue"
                    />
                    <MetricBox
                        icon={<Terminal className="w-5 h-5" />}
                        label="CLI Control"
                        value="V4.0.2-STABLE"
                        trend="Uplink Ready"
                        color="violet"
                    />
                </div>

                <div className="mt-20 p-12 zs-card bg-zs-bg-secondary/40 backdrop-blur-xl border-zs-blue/10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">¿Listo para escalar su infraestructura?</h3>
                        <p className="text-zs-text-secondary">Despliegue su primer nodo en segundos con nuestro orquestador automatizado.</p>
                    </div>
                    <Link href="/gateway" className="zs-btn-brand px-10 py-5 rounded-xl shadow-zs-glow-blue/20">
                        <span className="text-sm font-black uppercase tracking-widest">Inicializar Nodo</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}

function MetricBox({ icon, label, value, trend, color }: { icon: React.ReactNode, label: string, value: string, trend: string, color: 'blue' | 'cyan' | 'emerald' | 'violet' }) {
    const colorMap = {
        blue: "text-zs-blue bg-zs-blue/10 border-zs-blue/20",
        cyan: "text-zs-cyan bg-zs-cyan/10 border-zs-cyan/20",
        emerald: "text-zs-emerald bg-zs-emerald/10 border-zs-emerald/20",
        violet: "text-zs-violet bg-zs-violet/10 border-zs-violet/20",
    };

    return (
        <div className="zs-card p-6 bg-zs-bg-secondary/40 group overflow-hidden">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 border ${colorMap[color]}`}>
                {icon}
            </div>
            <h4 className="text-[10px] font-black text-zs-text-muted uppercase tracking-[0.2em] mb-2">{label}</h4>
            <div className="text-2xl font-black text-white mb-2">{value}</div>
            <div className="text-[10px] font-bold text-zs-text-secondary uppercase tracking-widest flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full animate-pulse ${color === 'emerald' ? 'bg-zs-emerald' : 'bg-zs-blue'}`} />
                {trend}
            </div>
        </div>
    );
}
