import React from "react";
import { Cookie, Shield, Info, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Política de Cookies | Zona Sur Tech",
    description: "Información detallada sobre el uso de cookies y tecnologías de seguimiento en la plataforma Zona Sur Tech.",
};

export default function CookiesPage() {
    return (
        <main className="min-h-screen bg-zs-bg-primary pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-zs-blue/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-zs-violet/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto relative z-10 max-w-4xl">
                <div className="mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zs-violet/10 border border-zs-violet/20 text-zs-violet mb-8">
                        <Cookie className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Cookie Policy v1.0</span>
                    </div>

                    <h1 className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.8] mb-8">
                        Política de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zs-violet via-zs-purple to-zs-blue drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                            Cookies
                        </span>
                    </h1>

                    <p className="text-xl text-zs-text-secondary font-light leading-relaxed">
                        En Zona Sur Tech utilizamos cookies para optimizar el rendimiento de la malla neural y personalizar su experiencia en la plataforma industrial.
                    </p>
                </div>

                <div className="space-y-12">
                    <Section 
                        title="¿Qué son las Cookies?"
                        content="Las cookies son pequeños fragmentos de datos almacenados en su nodo local (navegador) que nos permiten recordar sus preferencias de configuración, sesiones activas y telemetría de rendimiento."
                    />

                    <section className="zs-card p-10 bg-zs-bg-secondary/40 backdrop-blur-xl border-zs-border">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-zs-blue" />
                            Tipos de Cookies que Utilizamos
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <CookieType 
                                title="Esenciales"
                                description="Necesarias para el funcionamiento del Kernel y la autenticación Gateway."
                                required
                            />
                            <CookieType 
                                title="Analíticas"
                                description="Miden la latencia y el flujo de datos para optimizar nuestros nodos globales."
                            />
                            <CookieType 
                                title="Preferencia"
                                description="Recuerdan su configuración de terminal, tema y zona horaria industrial."
                            />
                            <CookieType 
                                title="Seguridad"
                                description="Detectan intentos de acceso no autorizados y protegen la integridad de sus datos."
                                required
                            />
                        </div>
                    </section>

                    <Section 
                        title="Control de Cookies"
                        content="Usted puede configurar su terminal de navegación para rechazar cookies analíticas. Sin embargo, las cookies esenciales son requeridas para mantener el enlace seguro con el ecosistema ZST."
                    />

                    <div className="p-8 rounded-3xl bg-zs-blue/5 border border-zs-blue/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Info className="w-8 h-8 text-zs-blue" />
                            <p className="text-sm text-zs-text-secondary">Para más información sobre el tratamiento de sus datos, consulte nuestra política de privacidad.</p>
                        </div>
                        <Link href="/legal/privacy" className="zs-btn-brand bg-white text-zs-blue shadow-none px-8 py-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-widest">Ver Privacidad</span>
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Section({ title, content }: { title: string, content: string }) {
    return (
        <section>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h2>
            <p className="text-zs-text-secondary leading-relaxed">{content}</p>
        </section>
    );
}

function CookieType({ title, description, required = false }: { title: string, description: string, required?: boolean }) {
    return (
        <div className="p-6 rounded-2xl bg-zs-bg-primary/50 border border-zs-border">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">{title}</h4>
                {required ? (
                    <span className="text-[10px] font-black text-zs-blue uppercase tracking-widest">Requerido</span>
                ) : (
                    <div className="w-4 h-4 rounded-full border border-zs-text-muted" />
                )}
            </div>
            <p className="text-xs text-zs-text-secondary leading-relaxed">{description}</p>
        </div>
    );
}
