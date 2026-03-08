import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilidad interna para manejar clases dinámicas (equivalente a cn en shadcn)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface VisionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function VisionCard({ children, className, ...props }: VisionCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[20px] bg-zs-bg-surface backdrop-blur-xl",
        "border border-zs-border shadow-zs-glass",
        "p-6 flex flex-col",
        className
      )}
      {...props}
    >
      {/* Resplandor superior sutil integrado en el borde superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </div>
  );
}
