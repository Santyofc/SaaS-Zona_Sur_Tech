"use client";

import React from "react";
import { motion } from "framer-motion";

interface DashboardContentProps {
    session: {
        userId: string;
        organizationId: string;
        role: string;
    };
}

export function DashboardContent({ session }: DashboardContentProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto space-y-8"
            role="main"
            aria-label="Contenido principal del Dashboard"
        >
            <motion.header variants={itemVariants} className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                    Centro de <span className="text-zs-blue shadow-zs-glow-blue">Operaciones</span>
                </h1>
                <p className="text-zs-text-secondary text-sm font-medium tracking-widest uppercase">
                    Estatus del sistema: <span className="text-zs-green animate-pulse" aria-label="Sistema operativo">Operativo</span>
                </p>
            </motion.header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Estadísticas rápidas">
                {/* Stats Cards */}
                {[
                    { label: "Organización", value: session.organizationId.split('-')[0], color: "text-zs-blue" },
                    { label: "Rol de Acceso", value: session.role.toUpperCase(), color: "text-zs-purple" },
                    { label: "ID de Usuario", value: session.userId.split('-')[0], color: "text-zs-green" },
                ].map((stat, i) => (
                    <motion.article
                        key={stat.label}
                        variants={itemVariants}
                        whileHover={{ y: -5, borderColor: "rgba(0, 247, 255, 0.3)" }}
                        className="p-6 rounded-2xl bg-zs-bg-secondary/40 backdrop-blur-xl border border-zs-border shadow-zs-glow-blue/5 group"
                        aria-label={`Estadística de ${stat.label}`}
                    >
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted mb-1">
                            {stat.label}
                        </p>
                        <p className={`text-2xl font-bold ${stat.color} group-hover:scale-110 transition-transform origin-left`}>
                            {stat.value}
                        </p>
                        <div className="mt-4 h-1 w-full bg-zs-border rounded-full overflow-hidden" role="progressbar" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "70%" }}
                                transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                                className={`h-full bg-gradient-to-r from-transparent to-current ${stat.color}`}
                            />
                        </div>
                    </motion.article>
                ))}
            </section>

            {/* Main Content Area */}
            <motion.section
                variants={itemVariants}
                className="relative p-8 rounded-3xl bg-zs-bg-secondary/20 backdrop-blur-3xl border border-zs-border overflow-hidden"
                aria-labelledby="verificacion-title"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zs-blue to-transparent opacity-50" />

                <h2 id="verificacion-title" className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-zs-blue animate-ping" aria-hidden="true" />
                    Verificación de Sesión Multitenant
                </h2>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-black/20 border border-zs-border/50">
                            <p className="text-xs font-bold text-zs-text-muted uppercase mb-2">Contexto de Seguridad</p>
                            <pre className="font-mono text-xs text-zs-blue break-all overflow-x-auto p-2" aria-label="JSON de datos de sesión">
                                {JSON.stringify(session, null, 2)}
                            </pre>
                        </div>
                        <div className="p-4 rounded-xl bg-black/20 border border-zs-border/50 flex flex-col justify-center italic">
                            <blockquote className="text-zs-text-secondary text-sm">
                                "Todos los encabezados de contexto multi-inquilino se resuelven correctamente a través de la sesión JWT endurecida."
                            </blockquote>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-zs-blue/5 rounded-full blur-[100px]" aria-hidden="true" />
            </motion.section>
        </motion.main>
    );
}
