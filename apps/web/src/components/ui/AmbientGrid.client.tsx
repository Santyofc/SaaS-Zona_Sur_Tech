"use client";

import React from "react";

export function AmbientGrid() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{
        backgroundImage:
          "radial-gradient(rgba(37,99,235,0.18) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage:
          "radial-gradient(circle at center, black 35%, transparent 85%)",
      }}
    />
  );
}
