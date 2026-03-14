"use client";

import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className, ...props }: LabelProps) {
  return (
    <label 
      className={`text-xs font-bold uppercase tracking-widest text-zs-text-tertiary mb-1 block ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
