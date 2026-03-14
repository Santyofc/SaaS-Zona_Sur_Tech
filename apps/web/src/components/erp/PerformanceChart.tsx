"use client";

import React from "react";

interface PerformanceChartProps {
  data: { date: string; amount: string }[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-zs-text-tertiary text-xs uppercase tracking-widest bg-zs-bg-primary/30 rounded-xl border border-dashed border-zs-border-primary">
        Initial Data Pending...
      </div>
    );
  }

  // Reverse data to show chronological order if needed (API returns desc)
  const sortedData = [...data].reverse();
  const values = sortedData.map(d => parseFloat(d.amount));
  const max = Math.max(...values, 100);
  const min = Math.min(...values);
  const range = max - min;

  // SVG dimensions
  const width = 400;
  const height = 150;
  const padding = 20;

  const points = sortedData.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (sortedData.length - 1 || 1);
    const y = height - padding - ((parseFloat(d.amount) - min) / (range || 1)) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative w-full h-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full drop-shadow-zs-glow-blue"
        preserveAspectRatio="none"
      >
        {/* Grid Lines */}
        {[0, 0.5, 1].map((p, i) => (
          <line
            key={i}
            x1={padding}
            y1={padding + p * (height - 2 * padding)}
            x2={width - padding}
            y2={padding + p * (height - 2 * padding)}
            className="stroke-zs-border-primary/30 stroke-1"
          />
        ))}

        {/* The Line */}
        <polyline
          fill="none"
          stroke="url(#gradient-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="animate-in fade-in duration-1000"
        />

        {/* Area Gradient Fill */}
        <polygon
          points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
          fill="url(#area-gradient)"
          className="opacity-20"
        />

        <defs>
          <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      {/* Date Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-[10px] text-zs-text-tertiary font-mono">
        <span>{sortedData[0].date}</span>
        <span>{sortedData[sortedData.length - 1].date}</span>
      </div>
    </div>
  );
}
