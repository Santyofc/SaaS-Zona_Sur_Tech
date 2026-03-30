import React from "react";
import { Users, Github, Twitter, MessageSquare, Globe, ArrowUpRight, Zap, Target } from "lucide-react";
import Link from "next/link";
import { GlitchText } from "@/components/ui/GlitchText.client";

export const metadata = {
    title: "Comunidad | Zona Sur Tech",
    description: "Únete al ecosistema de arquitectos e ingenieros que están construyendo el futuro del software industrial.",
};

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-zs-bg-primary pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-zs-blue/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-zs-violet/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="max-w-4xl mb-20">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-emerald/10 border border-zs-emerald/20 text-zs-emerald mb-8">
                        <Users className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Hub Social Activo</span>
                    </div>

                    <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-8">
                        Ecosistema <br />
                        <GlitchText 
                            text="Comunidad" 
                            className="text-transparent bg-clip-text bg-gradient-to-r from-zs-emerald via-zs-cyan to-zs-blue drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                        />
                    </h1>

                    <p className="text-xl text-zs-text-secondary font-light max-w-2xl leading-relaxed">
                        Colabore con los ingenieros más brillantes del planeta. Comparta arquitecturas, resuelva desafíos críticos y expanda el límite de lo posible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <CommunityCard 
                        icon={<Github className="w-6 h-6" />}
                        title="GitHub Lab"
                        description="Explore nuestro código base, contribuya a los módulos core y reporte vulnerabilidades."
                        stats="1.2k Stars"
                        href="https://github.com/Santyofc"
                        color="blue"
                    />
                    <CommunityCard 
                        icon={<MessageSquare className="w-6 h-6" />}
                        title="Discord Mesh"
                        description="Discusiones técnicas en tiempo real, soporte entre pares y sesiones de arquitectura en vivo."
                        stats="840 Online"
                        href="#"
                        color="violet"
                    />
                    <CommunityCard 
                        icon={<Twitter className="w-6 h-6" />}
                        title="X Terminal"
                        description="Actualizaciones instantáneas sobre el despliegue de nuevos nodos y parches de seguridad."
                        stats="12.4k Follows"
                        href="https://twitter.com/santidelgados_"
                        color="cyan"
                    />
                </div>

                <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Eventos de Ingeniería</h2>
                        <div className="space-y-6">
                            <EventItem 
                                title="Sync_Conf 2026"
                                date="OCT 12-14"
                                location="Ciberespacio / Costa Rica"
                            />
                            <EventItem 
                                title="ZS Node Workshop"
                                date="WEEKLY"
                                location="Virtual Mesh"
                            />
                        </div>
                    </div>
                    
                    <div className="zs-card p-12 bg-zs-bg-secondary/40 border-zs-blue/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform">
                            <Target className="w-32 h-32 text-zs-blue" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter relative z-10">Misión 2026</h3>
                        <p className="text-zs-text-secondary leading-relaxed relative z-10">
                            Nuestra meta es interconectar a 1 millón de ingenieros bajo una sola Red de Datos Atómica. Zona Sur Tech no es solo software; es un estándar de colaboración industrial.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function CommunityCard({ icon, title, description, stats, href, color }: { icon: React.ReactNode, title: string, description: string, stats: string, href: string, color: 'blue' | 'violet' | 'cyan' }) {
    const colors = {
        blue: "text-zs-blue border-zs-blue/20 bg-zs-blue/5",
        violet: "text-zs-violet border-zs-violet/20 bg-zs-violet/5",
        cyan: "text-zs-cyan border-zs-cyan/20 bg-zs-cyan/5",
    };

    return (
        <Link href={href} className="zs-card p-8 bg-zs-bg-secondary/40 hover:bg-zs-bg-secondary transition-all group border-zs-border hover:border-white/10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border ${colors[color]}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h3>
            <p className="text-zs-text-secondary text-sm mb-8 leading-relaxed">{description}</p>
            <div className="flex items-center justify-between border-t border-zs-border pt-6">
                <span className="text-[10px] font-black text-zs-text-muted uppercase tracking-widest">{stats}</span>
                <ArrowUpRight className="w-4 h-4 text-zs-text-muted group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
        </Link>
    );
}

function EventItem({ title, date, location }: { title: string, date: string, location: string }) {
    return (
        <div className="flex items-center justify-between p-6 zs-card bg-zs-bg-secondary/20 hover:bg-zs-bg-secondary/40 transition-colors border-zs-border">
            <div className="flex flex-col">
                <span className="text-zs-blue text-[10px] font-black uppercase tracking-[0.25em] mb-1">{date}</span>
                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{title}</h4>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[10px] text-zs-text-muted font-bold uppercase tracking-widest hidden md:block">{location}</span>
                <div className="w-8 h-8 rounded-lg bg-zs-bg-primary border border-zs-border flex items-center justify-center text-white hover:text-zs-blue transition-colors cursor-pointer">
                    <ArrowUpRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
