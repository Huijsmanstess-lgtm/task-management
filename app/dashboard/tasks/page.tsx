import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import TasksBoard from '@/components/dashboard/tasks-board';

async function getSession() {
  return getServerSession(authOptions);
}

export default async function DashboardTasksPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-8 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Tasks board</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-100">Kanban overzicht</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Werk je backlog bij met echte taken. Voeg snel nieuwe items toe, sleep ze door status.
            </p>
          </div>
        </div>
      </section>

      <TasksBoard />
    </div>
  );
}
