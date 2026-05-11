"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock3, Edit3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import EditTaskModal from '@/components/tasks/edit-task-modal';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { deleteTask } from '@/actions/task.actions';

const statusStyles: Record<string, string> = {
  todo: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
  'in-progress': 'bg-sky-500/10 text-sky-300 ring-sky-500/20',
  done: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
};

type TaskCardProps = {
  task: {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string | Date;
  };
};

export default function TaskCard({ task }: TaskCardProps) {
  const [currentTask, setCurrentTask] = useState(task);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const statusClass = statusStyles[currentTask.status] ?? statusStyles.todo;
  const createdAt = new Date(currentTask.createdAt).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteTask(currentTask._id);
      toast.success('Taak verwijderd');
      setIsRemoved(true);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Er is iets misgegaan bij het verwijderen.';
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  if (isRemoved) {
    return null;
  }

  return (
    <>
      <article className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-6 transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/95">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.33em] text-slate-500">Status</p>
            <span className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass}`}>
              {currentTask.status.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              <span>{createdAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-900/80" onClick={() => setIsModalOpen(true)} aria-label="Bewerk taak">
                <Edit3 className="h-4 w-4" />
              </Button>
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-900/80" aria-label="Verwijder taak">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Deze taak wordt permanent verwijderd. Deze actie kan niet ongedaan gemaakt worden.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="min-w-[120px]">Annuleren</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? 'Verwijderen...' : 'Verwijder taak'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-slate-100">{currentTask.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
          {currentTask.description || 'Geen beschrijving beschikbaar voor deze taak.'}
        </p>
      </article>

      <EditTaskModal
        open={isModalOpen}
        task={currentTask}
        onClose={() => setIsModalOpen(false)}
        onOptimisticUpdate={(updatedTask) => setCurrentTask(updatedTask)}
        onSaved={(savedTask) => {
          setCurrentTask(savedTask);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
