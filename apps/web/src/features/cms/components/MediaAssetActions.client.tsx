"use client";

import { useState, useTransition } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

interface MediaAssetActionsProps {
  publicUrl: string;
}

export function MediaAssetActions({ publicUrl }: MediaAssetActionsProps) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCopy = () => {
    startTransition(async () => {
      try {
        await navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(false);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className="p-2 rounded-lg bg-zs-bg-secondary border border-zs-border text-zs-text-muted hover:text-white transition-colors disabled:opacity-50"
        title={copied ? "URL copiada" : "Copiar URL publica"}
        disabled={isPending}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>

      <a
        href={publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-zs-bg-secondary border border-zs-border text-zs-text-muted hover:text-white transition-colors"
        title="Abrir archivo"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </>
  );
}
