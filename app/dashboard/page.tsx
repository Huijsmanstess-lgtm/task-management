import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import TaskForm from '@/components/tasks/task-form';
import TaskList, { TaskListSkeleton } from '@/components/tasks/task-list';

async function getSession() {
  return await getServerSession(authOptions);
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user?.email) {
    redirect('/login');
  }

  const userName = session.user.name ?? session.user.email;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Welcome back</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-100 sm:text-4xl">
              Hi {userName}, jouw taken staan klaar.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Modern overzicht van je taken, projecten en planning. Meer controle met slimme inzichten.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Voltooid</p>
              <p className="mt-4 text-3xl font-semibold text-slate-100">18</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Open taken</p>
              <p className="mt-4 text-3xl font-semibold text-slate-100">7</p>
            </div>
          </div>
        </div>
      </section>

      <TaskForm />

      <Suspense fallback={<TaskListSkeleton />}>
        <TaskList userId={session.user.id} />
      </Suspense>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.95fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400/70">Actuele focus</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-100">Vandaag staat er veel op de planning</h2>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <p className="text-sm text-slate-400">Launch marketing campaign</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                <span>Web team</span>
                <span className="rounded-full bg-slate-800/80 px-3 py-1 text-slate-400">In progress</span>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <p className="text-sm text-slate-400">Team sync + backlog review</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                <span>Planning</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">Tomorrow</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400/70">Account</p>
            <p className="mt-4 text-xl font-semibold text-slate-100">{userName}</p>
            <p className="mt-2 text-sm text-slate-400">{session.user.email}</p>
          </div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/10">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400/70">Team status</p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p>2 nieuwe teamupdates</p>
              </div>
              <div className="rounded-2xl bg-slate-900/80 p-4 text-sm text-slate-300">
                <p>3 taken staan op review</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
