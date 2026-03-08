import { Suspense } from "react";

export default function AcceptInvitationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zs-bg-primary flex items-center justify-center">
          <div className="flex items-center gap-3 text-zs-text-secondary">
            <div className="w-5 h-5 rounded-full border-2 border-zs-blue border-t-transparent animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
