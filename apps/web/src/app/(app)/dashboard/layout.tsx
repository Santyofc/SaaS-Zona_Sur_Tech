import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen bg-zs-bg-primary">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[-12%] h-60 w-60 rounded-full bg-zs-cyan/10 blur-[100px]" />
        <div className="absolute bottom-[-12%] right-[12%] h-56 w-56 rounded-full bg-zs-violet/10 blur-[90px]" />
      </div>
      <DashboardSidebar />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
