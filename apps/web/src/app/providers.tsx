"use client";

import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: PropsWithChildren) {
  // No mounted guard needed: ThemeProvider with defaultTheme="dark" + enableSystem={false}
  // already prevents theme flash. The opacity-0 pattern caused CLS.

  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      defaultTheme="dark"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-zs-bg-secondary)',
            color: 'var(--color-zs-text-primary)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '14px',
            borderRadius: '12px',
            fontFamily: 'monospace',
          },
          duration: 4000,
        }}
      />
      {children}
    </ThemeProvider>
  );
}
