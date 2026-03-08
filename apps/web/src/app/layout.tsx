import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollToTop from "../components/ScrollToTop";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import Providers from "./providers";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZonaSur Tech - Next Generation SaaS",
  description: "High-performance architecture by ZonaSur Tech. Designed for extreme scalability and premium interactive experiences.",
};

import { ZSCommand } from "../components/Common/ZSCommand";

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
    <html suppressHydrationWarning className="!scroll-smooth" lang="en">
      <body>
        <Providers>
          <div className="isolate relative">
            <CursorTrail />
            <ZSCommand />
            <Header />

            {children}

            <Footer />
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
