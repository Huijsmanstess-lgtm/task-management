"use client"

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: session, status } = useSession();
  const userName = session?.user?.name ?? session?.user?.email ?? 'Guest';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">Task Management</p>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Secure dashboard for your tasks</h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-400 sm:text-lg">
            Register, login, and manage tasks with secure authentication powered by NextAuth, MongoDB, and bcrypt.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/login">
            <Button className="w-full">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" className="w-full">Register</Button>
          </Link>
          {status === 'authenticated' ? (
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full">Go to dashboard</Button>
            </Link>
          ) : (
            <div className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
              {status === 'loading' ? 'Checking session...' : `Hello ${userName}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
