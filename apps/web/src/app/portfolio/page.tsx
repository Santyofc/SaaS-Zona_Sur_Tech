import dynamic from "next/dynamic";

const PortfolioLatest = dynamic(
  () => import("@repo/ui-experiments").then((mod) => ({ default: mod.PortfolioLatest })),
  { ssr: false }
);

export default function Portfolio() {
  return (
    <main className="w-full bg-zs-bg-primary min-h-screen">
      <PortfolioLatest />
    </main>
  );
}
