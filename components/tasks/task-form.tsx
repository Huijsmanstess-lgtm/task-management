"use client";

import { useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { createTask } from '@/actions/task.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const statusOptions = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
] as const;

export default function TaskForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    startTransition(() => {
      createTask(formData)
        .then(() => {
          toast.success('Taak succesvol toegevoegd');
          formRef.current?.reset();
          router.refresh();
        })
        .catch((error) => {
          const message = error instanceof Error ? error.message : 'Er is iets misgegaan.';
          toast.error(message);
        });
    });
  };

  return (
    <div className="rounded-[2rem] border border-slate-800 bg-slate-950/85 p-6 shadow-lg shadow-slate-950/20">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Nieuwe taak</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">Voeg snel een taak toe</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
          <Plus className="h-4 w-4 text-sky-400" />
          Add task
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-[1.8fr_1fr]">
          <label className="space-y-2 text-sm text-slate-300">
            Titel
            <Input name="title" placeholder="Bijv. Nieuwe homepage content" required className="h-11 rounded-2xl bg-slate-950/90 border-slate-800 px-4 text-slate-100 placeholder:text-slate-500" />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Status
            <select
              name="status"
              defaultValue="todo"
              className="h-11 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 text-slate-100 outline-none transition hover:border-slate-700 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/20"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value} className="bg-slate-950 text-slate-100">
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm text-slate-300">
          Beschrijving
          <textarea
            name="description"
            rows={4}
            placeholder="Beschrijf de taak kort en duidelijk..."
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition hover:border-slate-700 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/20"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">Zorg dat titel en status zijn ingevuld voordat je opslaat.</p>
          <Button type="submit" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {isPending ? 'Bezig...' : 'Taak toevoegen'}
          </Button>
        </div>
      </form>
    </div>
  );
}
