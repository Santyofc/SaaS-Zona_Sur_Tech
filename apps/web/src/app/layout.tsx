import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import Providers from "./providers";
import dynamic from "next/dynamic";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://zonasurtech.online"),
  title: "ZonaSur Tech - Next Generation SaaS",
  description: "High-performance architecture by ZonaSur Tech. Designed for extreme scalability and premium interactive experiences.",
  alternates: {
    canonical: "./",
  },
};

const HackerCursor = dynamic(
  () => import("../components/ui/HackerCursor.client").then((mod) => ({ default: mod.HackerCursor })),
  { ssr: false }
);

const ZSCommand = dynamic(
  () => import("../components/Common/ZSCommand").then((mod) => ({ default: mod.ZSCommand })),
  { ssr: false }
);

const ScrollToTop = dynamic(
  () => import("../components/ScrollToTop"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="!scroll-smooth" lang="en">
      <body className="bg-zs-bg-primary">
        <Providers>
          <div className="isolate relative min-h-screen">
            <HackerCursor />
            <ZSCommand />
            {children}
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
