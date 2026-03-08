import { cookies } from 'next/headers';
import { decrypt } from '@repo/auth';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default async function DashboardPage() {
  const token = cookies().get('session')?.value;
  const session = token ? await decrypt(token) : null;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zs-bg-primary text-zs-text-primary">
        <h1 className="text-2xl font-bold mb-4">No session found</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <DashboardContent session={session as any} />
    </div>
  );
}
