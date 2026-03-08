"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";

type LogEntry = {
    type: "input" | "system" | "success" | "error";
    content: string;
};

export function TerminalFeedback() {
    const [input, setInput] = useState("");
    const [logs, setLogs] = useState<LogEntry[]>([
        { type: "system", content: "ZS-OS Feedback Uplink established..." },
        { type: "system", content: "Type your report below and press ENTER to transmit." },
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSubmitting) return;

        const userMessage = input.trim();
        setInput("");
        setLogs((prev) => [...prev, { type: "input", content: userMessage }]);

        // Simulate system processing
        setIsSubmitting(true);
        setLogs((prev) => [...prev, { type: "system", content: "Encrypting packet..." }]);

        await new Promise((r) => setTimeout(r, 800));
        setLogs((prev) => [...prev, { type: "system", content: "Routing through Node-74 (Buenos Aires)..." }]);

        await new Promise((r) => setTimeout(r, 1200));

        if (userMessage.toLowerCase().includes("error") || userMessage.toLowerCase().includes("bug")) {
            setLogs((prev) => [...prev, { type: "success", content: "Report categorized: CRITICAL_BUG. Developer team notified." }]);
        } else {
            setLogs((prev) => [...prev, { type: "success", content: "Feedback received. Transmission successful." }]);
        }

        setIsSubmitting(false);
        setIsDone(true);

        setTimeout(() => {
            setLogs((prev) => [...prev, { type: "system", content: "Uplink standby. Session persistent." }]);
            setIsDone(false);
        }, 3000);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="zs-card bg-[#06080b] border-zs-border overflow-hidden shadow-zs-glow-blue/5">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-zs-bg-primary/80 border-b border-zs-border">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-zs-rose/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zs-amber/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zs-emerald/40" />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-zs-text-muted uppercase tracking-widest">
                        <Terminal className="w-3 h-3" />
                        Feedback_Uplink.sh
                    </div>
                    <div className="w-12" />
                </div>

                {/* Terminal Content */}
                <div
                    ref={scrollRef}
                    className="h-[300px] overflow-y-auto p-6 font-mono text-sm space-y-2 scrollbar-hide select-text"
                >
                    <AnimatePresence initial={false}>
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-3 leading-relaxed"
                            >
                                {log.type === "input" && (
                                    <span className="text-zs-blue shrink-0">guest@zs:~$</span>
                                )}
                                <span className={`
                  ${log.type === "system" ? "text-zs-text-muted italic" : ""}
                  ${log.type === "success" ? "text-zs-emerald flex items-center gap-2" : ""}
                  ${log.type === "error" ? "text-zs-rose flex items-center gap-2" : ""}
                  ${log.type === "input" ? "text-white" : ""}
                `}>
                                    {log.type === "success" && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {log.type === "error" && <AlertCircle className="w-3.5 h-3.5" />}
                                    {log.content}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {isSubmitting && (
                        <motion.div
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-zs-blue font-black flex items-center gap-2"
                        >
                            <div className="w-1 h-4 bg-zs-blue animate-pulse" />
                            TRANSMITIENDO...
                        </motion.div>
                    )}
                </div>

                {/* Terminal Footer / Input */}
                <form onSubmit={handleSubmit} className="p-4 bg-zs-bg-primary/30 border-t border-zs-border flex gap-3">
                    <div className="flex items-center text-zs-blue font-bold">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isSubmitting}
                        placeholder={isSubmitting ? "Sincronizando..." : "Escribe tu reporte..."}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-zs-text-muted text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || !input.trim()}
                        className="p-2 text-zs-text-secondary hover:text-white transition-colors disabled:opacity-30"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>

            <div className="mt-4 flex justify-center">
                <div className="px-4 py-1.5 rounded-full bg-zs-emerald/10 border border-zs-emerald/20 text-[10px] font-black text-zs-emerald uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-zs-emerald animate-pulse" />
                    Estatus: Conexión Segura (TLS 1.3)
                </div>
            </div>
        </div>
    );
}
