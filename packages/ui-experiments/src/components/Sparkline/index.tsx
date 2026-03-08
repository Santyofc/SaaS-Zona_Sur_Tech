"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface SparklineProps {
    width?: number;
    height?: number;
    color?: string;
    points?: number;
    speed?: number;
    className?: string;
}

export default function Sparkline({
    width = 100,
    height = 30,
    color = "currentColor",
    points = 12,
    speed = 2,
    className = ""
}: SparklineProps) {
    // Generate a semi-random path
    const path = useMemo(() => {
        const step = width / (points - 1);
        return Array.from({ length: points }, (_, i) => ({
            x: i * step,
            y: Math.random() * height
        }));
    }, [width, height, points]);

    const pathString = path.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                <motion.path
                    d={pathString}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: 1,
                        opacity: [0.3, 0.6, 0.3],
                        d: [
                            pathString,
                            path.map((p, i) => `L ${p.x} ${Math.random() * height}`).join(" ").replace(/^L/, "M"),
                            pathString
                        ]
                    }}
                    transition={{
                        duration: speed,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        filter: `drop-shadow(0 0 4px ${color})`
                    }}
                />
            </svg>
        </div>
    );
}
