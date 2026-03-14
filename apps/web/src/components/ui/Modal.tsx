"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zs-bg-primary/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zs-bg-secondary w-full max-w-lg rounded-2xl border border-zs-border-primary shadow-zs-glow-blue overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zs-border-primary bg-zs-bg-tertiary/50">
          <h2 className="text-xl font-bold text-zs-text-primary tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-zs-text-tertiary hover:text-zs-text-primary hover:bg-zs-bg-tertiary transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
