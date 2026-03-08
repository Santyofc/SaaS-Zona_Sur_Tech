"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Terminal,
    Globe,
    Cpu,
    Zap,
    Shield,
    Database,
    Code2,
    ArrowRight,
    LogOut,
    User,
    Settings,
    CreditCard
} from "lucide-react";
import { useRouter } from "next/navigation";

export function ZSCommand() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    // Toggle the menu when pressing Cmd+K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (action: () => void) => {
        action();
        setOpen(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center pt-[15vh] px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-zs-bg-primary/80 backdrop-blur-sm"
                    />

                    {/* Command Menu Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-2xl bg-zs-bg-secondary border border-zs-border rounded-2xl shadow-zs-glass overflow-hidden"
                    >
                        <Command className="flex flex-col h-full font-mono">
                            {/* Header / Input */}
                            <div className="flex items-center border-b border-zs-border px-4 py-3 bg-zs-bg-primary/50">
                                <Terminal className="w-5 h-5 text-zs-blue mr-3" />
                                <Command.Input
                                    autoFocus
                                    placeholder="Escribe un comando o busca..."
                                    className="flex-1 bg-transparent border-none outline-none text-zs-text-primary placeholder:text-zs-text-muted text-sm"
                                />
                                <div className="flex items-center gap-1.5 ml-2">
                                    <kbd className="px-1.5 py-0.5 rounded bg-zs-bg-primary border border-zs-border text-[10px] text-zs-text-muted">ESC</kbd>
                                </div>
                            </div>

                            <Command.List className="max-h-[350px] overflow-y-auto p-2 scrollbar-hide">
                                <Command.Empty className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Database className="w-8 h-8 text-zs-text-muted opacity-20" />
                                        <p className="text-sm text-zs-text-muted">No se encontraron resultados para esta consulta.</p>
                                    </div>
                                </Command.Empty>

                                <Command.Group heading={<span className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">Sistemas & Navegación</span>}>
                                    <ZSItem onSelect={() => runCommand(() => router.push("/"))}>
                                        <Globe className="w-4 h-4" />
                                        <span>Inicio / Dashboard Global</span>
                                        <span className="ml-auto text-[10px] text-zs-text-muted">G + H</span>
                                    </ZSItem>
                                    <ZSItem onSelect={() => runCommand(() => router.push("/systems"))}>
                                        <Cpu className="w-4 h-4" />
                                        <span>Nodos & Sistemas Core</span>
                                        <span className="ml-auto text-[10px] text-zs-text-muted">G + S</span>
                                    </ZSItem>
                                    <ZSItem onSelect={() => runCommand(() => router.push("/technology"))}>
                                        <Code2 className="w-4 h-4" />
                                        <span>Arquitectura Tecnológica</span>
                                        <span className="ml-auto text-[10px] text-zs-text-muted">G + T</span>
                                    </ZSItem>
                                </Command.Group>

                                <Command.Separator className="h-px bg-zs-border my-2" />

                                <Command.Group heading={<span className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">Acciones de Cuenta</span>}>
                                    <ZSItem onSelect={() => runCommand(() => router.push("/signin"))}>
                                        <User className="w-4 h-4" />
                                        <span>Acceso Kernel (Sign In)</span>
                                    </ZSItem>
                                    <ZSItem onSelect={() => runCommand(() => router.push("/pricing"))}>
                                        <CreditCard className="w-4 h-4" />
                                        <span>Planes & Suscripciones</span>
                                    </ZSItem>
                                    <ZSItem onSelect={() => runCommand(() => router.push("/settings"))} disabled>
                                        <Settings className="w-4 h-4" />
                                        <span>Configuración Global</span>
                                        <span className="ml-auto text-[10px] text-zs-blue bg-zs-blue/10 px-1 rounded">RESTRIGIDO</span>
                                    </ZSItem>
                                </Command.Group>

                                <Command.Separator className="h-px bg-zs-border my-2" />

                                <Command.Group heading={<span className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zs-text-muted">Utilidades Hacker</span>}>
                                    <ZSItem onSelect={() => console.log("Glitch Mode Activated")}>
                                        <Zap className="w-4 h-4" />
                                        <span>Activar Modo Glitch</span>
                                        <span className="ml-auto"><div className="w-2 h-2 rounded-full bg-zs-rose animate-pulse" /></span>
                                    </ZSItem>
                                    <ZSItem onSelect={() => runCommand(() => router.push("/status"))}>
                                        <Shield className="w-4 h-4" />
                                        <span>Estado del Nodo Central</span>
                                        <span className="ml-auto text-[10px] text-zs-emerald font-black">ONLINE</span>
                                    </ZSItem>
                                </Command.Group>
                            </Command.List>

                            {/* Footer */}
                            <div className="border-t border-zs-border p-3 bg-zs-bg-primary/30 flex items-center justify-between text-[10px] text-zs-text-muted uppercase tracking-widest font-black">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3" /> Seleccionar</span>
                                    <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 rotate-90" /> Navegar</span>
                                </div>
                                <div>ZS-OS v4.0.2</div>
                            </div>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function ZSItem({ children, onSelect, disabled }: { children: React.ReactNode; onSelect?: () => void; disabled?: boolean }) {
    return (
        <Command.Item
            onSelect={onSelect}
            disabled={disabled}
            className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm transition-all
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-zs-bg-primary text-zs-text-secondary hover:text-white hover:shadow-zs-glow-blue/10'}
        aria-selected:bg-zs-bg-primary aria-selected:text-white aria-selected:shadow-zs-glow-blue/10
      `}
        >
            {children}
        </Command.Item>
    );
}
