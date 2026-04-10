export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[8%] top-[-14%] h-[28rem] w-[28rem] rounded-full bg-zs-cyan/10 blur-[120px]" />
        <div className="absolute bottom-[-18%] right-[10%] h-[24rem] w-[24rem] rounded-full bg-zs-violet/10 blur-[100px]" />
      </div>
      {children}
    </div>
  );
}
