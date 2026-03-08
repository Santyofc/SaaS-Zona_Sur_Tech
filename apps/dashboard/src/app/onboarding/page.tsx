'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@repo/ui';

export default function OnboardingPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success! Refresh and go to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zs-bg-primary p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-zs-border bg-zs-bg-secondary p-8 shadow-zs-glow-blue">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zs-accent-primary">
            Create your workspace
          </h1>
          <p className="mt-2 text-sm text-zs-text-secondary">
            Set up your organization to start managing VMs.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Organization Name"
              type="text"
              placeholder="e.g. Acme Tech"
              required
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Create Organization
          </Button>

          <p className="text-center text-xs text-zs-text-muted">
            You can always change your organization settings later.
          </p>
        </form>
      </div>
    </div>
  );
}
