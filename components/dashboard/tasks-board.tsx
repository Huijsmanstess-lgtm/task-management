"use client";

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';

const statusColumns = [
  { key: 'todo', label: 'Todo' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
] as const;

type TaskItem = {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
  });
}

export default function TasksBoard() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupedTasks = useMemo(
    () =>
      statusColumns.map((column) => ({
        ...column,
        items: tasks.filter((task) => task.status === column.key),
      })),
    [tasks]
  );

  async function fetchTasks() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Kon taken niet laden.');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is iets misgegaan.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateTask() {
    if (!newTitle.trim()) {
      toast.error('Vul een titel in voor je taak.');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim(),
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Kon taak niet aanmaken.');
      }

      const created = await response.json();
      setTasks((current) => [created, ...current]);
      setNewTitle('');
      setNewDescription('');
      setIsModalOpen(false);
      toast.success('Taak toegevoegd');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is iets misgegaan.');
    } finally {
      setIsSaving(false);
    }
  }

  async function openDeleteDialog(taskId: string) {
    setDeleteTaskId(taskId);
    setDeleteDialogOpen(true);
  }

  async function confirmDeleteTask() {
    if (!deleteTaskId) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/tasks/${deleteTaskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Kon taak niet verwijderen.');
      }

      setTasks((current) => current.filter((task) => task._id !== deleteTaskId));
      toast.success('Taak verwijderd');
      setDeleteDialogOpen(false);
      setDeleteTaskId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is iets misgegaan.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Kanban</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">Jouw taken per status</h2>
          <p className="mt-2 text-slate-400">
            Sleep taken door de pijplijn of verwijder ze snel. Nieuwe taken worden automatisch in Todo geplaatst.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nieuwe taak
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="grid gap-4 lg:grid-cols-3">
          {statusColumns.map((column) => (
            <div key={column.key} className="rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-5">
              <div className="flex items-center justify-between gap-3 pb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{column.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-100">{groupedTasks.find((item) => item.key === column.key)?.items.length ?? 0}</p>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-3 py-6">
                  <div className="h-4 rounded-full bg-slate-800" />
                  <div className="h-4 rounded-full bg-slate-800" />
                  <div className="h-4 rounded-full bg-slate-800" />
                </div>
              ) : groupedTasks.find((item) => item.key === column.key)?.items.length ? (
                <div className="space-y-4">
                  {groupedTasks
                    .find((item) => item.key === column.key)
                    ?.items.map((task) => (
                      <article key={task._id} className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4 shadow-sm shadow-slate-950/10">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{task.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-3">{task.description || 'Geen beschrijving beschikbaar.'}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-300 hover:bg-slate-900/80"
                            onClick={() => openDeleteDialog(task._id)}
                            aria-label="Verwijder taak"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500">
                          {formatDate(task.createdAt)}
                        </p>
                      </article>
                    ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-6 text-center text-slate-400">
                  <p className="text-sm">Geen taken in deze kolom.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-100">Nieuwe taak toevoegen</h3>
                <p className="mt-2 text-sm text-slate-400">Voer een titel en beschrijving in om snel te starten.</p>
              </div>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Annuleer
              </Button>
            </div>

            <div className="space-y-5">
              <label className="block text-sm text-slate-300">
                Titel
                <Input
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Bijv. Update homepage copy"
                  className="mt-2 h-12 rounded-2xl bg-slate-950/90 border-slate-800 px-4 text-slate-100"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Beschrijving
                <textarea
                  value={newDescription}
                  onChange={(event) => setNewDescription(event.target.value)}
                  rows={4}
                  placeholder="Omschrijf de taak in een paar zinnen..."
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/20"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Sluiten
              </Button>
              <Button onClick={handleCreateTask} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {isSaving ? 'Toevoegen...' : 'Taak toevoegen'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
    
        <AlertDialogContent className="z-[100]">
          <AlertDialogHeader>
            <AlertDialogTitle>Taak verwijderen</AlertDialogTitle>
            <AlertDialogDescription>
              Deze taak wordt permanent verwijderd. Dit kan niet ongedaan gemaakt worden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)} className="min-w-[120px]">
              Annuleren
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} disabled={isDeleting}>
              {isDeleting ? 'Verwijderen...' : 'Verwijder taak'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
