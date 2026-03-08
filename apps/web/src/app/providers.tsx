"use client";

import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

import { MotionProvider } from "@repo/ui/src/MotionProvider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      defaultTheme="light"
    >
      <MotionProvider>
        <Toaster />
        {children}
      </MotionProvider>
    </ThemeProvider>
  );
}
