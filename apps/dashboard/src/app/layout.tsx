import "../styles/globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import dynamic from "next/dynamic";
import ScrollToTop from "@/components/layout/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

const CursorTrail = dynamic(
  () => import("@repo/ui-experiments").then((mod) => ({ default: mod.CursorTrail })),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-zs-bg-primary overflow-x-hidden`}>
        <Providers>
          <div className="isolate relative min-h-screen">
            {/* Background Orbs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zs-blue/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-zs-violet/10 rounded-full blur-[100px] pointer-events-none z-0" />

            <CursorTrail />
            {children}
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
