"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Shield, Zap, Cpu, Server, Globe } from "lucide-react";

const NODES = [
    { id: 1, x: "20%", y: "30%", name: "Edge-Alpha-01", type: "Gateway", status: "Active", latency: "12ms" },
    { id: 2, x: "40%", y: "20%", name: "Node-Santy-07", type: "Compute", status: "Active", latency: "8ms" },
    { id: 3, x: "60%", y: "40%", name: "Kernel-Core", type: "Database", status: "Protected", latency: "4ms" },
    { id: 4, x: "80%", y: "25%", name: "CDN-Global-X", type: "Edge", status: "Active", latency: "15ms" },
    { id: 5, x: "30%", y: "70%", name: "Vault-Security", type: "Auth", status: "Secure", latency: "2ms" },
    { id: 6, x: "70%", y: "75%", name: "Sync-Bridge", type: "Bridge", status: "Standby", latency: "22ms" },
];

const CONNECTIONS = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 1, to: 5 },
    { from: 3, to: 4 },
    { from: 3, to: 6 },
    { from: 5, to: 6 },
];

export function NeuralNetworkMap() {
    const [selectedNode, setSelectedNode] = useState(NODES[2]);

    return (
        <div className="relative w-full h-[600px] bg-zs-bg-primary/50 rounded-[3rem] border border-zs-border overflow-hidden group perspective-[1000px]">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.03] animate-zs-grid-pulse"
                style={{
                    backgroundImage: `linear-gradient(var(--color-zs-blue) 1px, transparent 1px), linear-gradient(90deg, var(--color-zs-blue) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                }}
            />

            {/* SVG Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-zs-blue)" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="var(--color-zs-cyan)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="var(--color-zs-blue)" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                {CONNECTIONS.map((conn, i) => {
                    const fromNode = NODES.find(n => n.id === conn.from)!;
                    const toNode = NODES.find(n => n.id === conn.to)!;
                    return (
                        <React.Fragment key={i}>
                            <line
                                x1={fromNode.x}
                                y1={fromNode.y}
                                x2={toNode.x}
                                y2={toNode.y}
                                stroke="url(#lineGrad)"
                                strokeWidth="1"
                                className="opacity-20"
                            />
                            {/* Packet Flow Animation */}
                            <circle r="2" fill="var(--color-zs-cyan)" className="animate-zs-packet">
                                <animateMotion
                                    dur={`${2 + Math.random() * 2}s`}
                                    repeatCount="indefinite"
                                    path={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
                                />
                            </circle>
                        </React.Fragment>
                    );
                })}
            </svg>

            {/* Nodes Layer */}
            {NODES.map((node) => (
                <motion.div
                    key={node.id}
                    style={{ left: node.x, top: node.y }}
                    whileHover={{ scale: 1.2, z: 50 }}
                    onClick={() => setSelectedNode(node)}
                    className={`
            absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20
            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
            ${selectedNode.id === node.id
                            ? "bg-zs-blue text-white shadow-zs-glow-blue border-white/20"
                            : "bg-zs-bg-secondary text-zs-text-secondary border border-zs-border hover:border-zs-blue/50"}
          `}
                >
                    {node.type === "Gateway" && <Globe className="w-5 h-5" />}
                    {node.type === "Compute" && <Cpu className="w-5 h-5" />}
                    {node.type === "Database" && <Server className="w-5 h-5" />}
                    {node.type === "Auth" && <Shield className="w-5 h-5" />}
                    {node.type === "Edge" && <Zap className="w-5 h-5" />}
                    {node.type === "Bridge" && <Activity className="w-5 h-5" />}

                    {/* Node Pulse */}
                    <div className={`absolute -inset-1 rounded-xl opacity-20 animate-ping ${selectedNode.id === node.id ? "bg-zs-blue" : "bg-zs-text-muted"}`} />
                </motion.div>
            ))}

            {/* Selected Node Details Card */}
            <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute bottom-8 right-8 w-64 zs-card p-6 bg-zs-bg-secondary/80 backdrop-blur-xl z-30"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-zs-blue/10 flex items-center justify-center text-zs-blue">
                        <Zap className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tighter">{selectedNode.name}</h4>
                        <p className="text-[10px] text-zs-text-muted uppercase tracking-widest">{selectedNode.type}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-zs-text-muted">Status</span>
                        <span className="text-zs-emerald">{selectedNode.status}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-zs-text-muted">Latency</span>
                        <span className="text-zs-blue">{selectedNode.latency}</span>
                    </div>
                    <div className="zs-progress w-full mt-2">
                        <div className="zs-progress-bar w-[85%]" />
                    </div>
                </div>
            </motion.div>

            {/* UI Accents */}
            <div className="absolute top-8 left-8 text-[10px] font-black text-zs-text-muted uppercase tracking-[0.4em] z-10">
                ZonaSur_Neural_Grid.v4
            </div>
        </div>
    );
}
