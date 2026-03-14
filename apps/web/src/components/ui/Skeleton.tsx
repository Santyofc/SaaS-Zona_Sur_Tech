"use client";

import React from "react";

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-zs-bg-tertiary rounded-lg border border-zs-border-primary" />
      <div className="space-y-2">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex gap-4">
            {[...Array(cols)].map((_, j) => (
              <div key={j} className="h-8 bg-zs-bg-tertiary/50 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-zs-bg-secondary p-6 rounded-2xl border border-zs-border-primary shadow-zs-glow-soft animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-zs-bg-tertiary mb-4" />
          <div className="h-6 bg-zs-bg-tertiary rounded w-3/4 mb-2" />
          <div className="h-4 bg-zs-bg-tertiary/50 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
