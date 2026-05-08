"use client";

import { useEffect, useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updateTask } from '@/actions/task.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const statusOptions = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
] as const;

type TaskPayload = {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: string | Date;
};

type EditTaskModalProps = {
  open: boolean;
  task: TaskPayload;
  onClose: () => void;
  onOptimisticUpdate: (task: TaskPayload) => void;
  onSaved: (task: TaskPayload) => void;
};

export default function EditTaskModal({ open, task, onClose, onOptimisticUpdate, onSaved }: EditTaskModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [status, setStatus] = useState(task.status);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle(task.title);
      setDescription(task.description ?? '');
      setStatus(task.status);
      setIsSaving(false);
    }
  }, [open, task.title, task.description, task.status]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    const updatedTask: TaskPayload = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      status,
    };

    onOptimisticUpdate(updatedTask);

    try {
      const formData = new FormData();
      formData.append('title', updatedTask.title);
      formData.append('description', updatedTask.description ?? '');
      formData.append('status', updatedTask.status);

      const savedTask = await updateTask(task._id, formData);
      onSaved(savedTask as TaskPayload);
      toast.success('Taak succesvol bijgewerkt');
      router.refresh();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Er is iets misgegaan bij het opslaan.';
      toast.error(message);
      onOptimisticUpdate(task);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/30">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Taak bewerken</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">Update titel, status en beschrijving</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-slate-300">
            Titel
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Bijv. Nieuwe homepage content"
              required
              className="mt-2 rounded-2xl bg-slate-950/90 border-slate-800 px-4 py-3 text-slate-100 placeholder:text-slate-500"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Beschrijving
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition hover:border-slate-700 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/20"
              placeholder="Geef de taak extra context..."
            />
          </label>

          <label className="block text-sm text-slate-300">
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as TaskPayload['status'])}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition hover:border-slate-700 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/20"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-sm text-slate-400">Sla je wijzigingen op zodra alles klopt.</p>
            <Button type="submit" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3" disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? 'Opslaan...' : 'Wijzigingen opslaan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
