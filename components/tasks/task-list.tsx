import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import TaskCard from '@/components/tasks/task-card';

export function TaskListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-6">
          <div className="h-4 w-24 rounded-full bg-slate-800" />
          <div className="mt-5 h-6 w-32 rounded-full bg-slate-800" />
          <div className="mt-4 space-y-3">
            <div className="h-4 rounded-full bg-slate-800" />
            <div className="h-4 rounded-full bg-slate-800" />
            <div className="h-4 w-3/4 rounded-full bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

type TaskListProps = {
  userId: string;
};

export default async function TaskList({ userId }: TaskListProps) {
  await connectDB();
  const tasks = await Task.find({ userId }).sort({ createdAt: -1 }).lean();

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Taken</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Jouw recente taken</h2>
        </div>
        <div className="rounded-2xl bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
          {tasks.length} taak{tasks.length === 1 ? '' : 'en'} gevonden
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/80 p-12 text-center text-slate-400">
          <p className="text-lg font-semibold text-slate-100">Geen taken gevonden</p>
          <p className="mt-2 max-w-md mx-auto text-sm leading-6">
            Voeg een nieuwe taak toe om direct te zien hoe je takenlijst groeit. De nieuwste taken verschijnen bovenaan.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task._id.toString()} task={task as any} />
          ))}
        </div>
      )}
    </section>
  );
}
