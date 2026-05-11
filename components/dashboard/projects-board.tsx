"use client";

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const colorStyles: Record<string, string> = {
  sky: 'bg-sky-500/10 text-sky-300 ring-sky-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-300 ring-amber-500/20',
  fuchsia: 'bg-fuchsia-500/10 text-fuchsia-300 ring-fuchsia-500/20',
  slate: 'bg-slate-500/10 text-slate-300 ring-slate-500/20',
};

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On hold' },
] as const;

const colorOptions = [
  { value: 'sky', label: 'Sky' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'amber', label: 'Amber' },
  { value: 'fuchsia', label: 'Fuchsia' },
  { value: 'slate', label: 'Slate' },
] as const;

type ProjectItem = {
  _id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'on-hold';
  color: string;
  taskCount: number;
  createdAt: string;
};

export default function ProjectsBoard() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'completed' | 'on-hold'>('active');
  const [color, setColor] = useState('sky');

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Kon projecten niet laden.');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is iets misgegaan.');
    } finally {
      setLoading(false);
    }
  }

  async function createProject() {
    if (!name.trim()) {
      toast.error('Geef een projectnaam op.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          status,
          color,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Kon project niet aanmaken.');
      }

      const created = await response.json();
      setProjects((current) => [created, ...current]);
      setName('');
      setDescription('');
      setStatus('active');
      setColor('sky');
      setModalOpen(false);
      toast.success('Project aangemaakt');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is iets misgegaan.');
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteProject(projectId: string) {
    const confirmed = window.confirm('Weet je zeker dat je dit project wilt verwijderen?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body?.error || 'Kon project niet verwijderen.');
      }

      setProjects((current) => current.filter((project) => project._id !== projectId));
      toast.success('Project verwijderd');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is iets misgegaan.');
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Projecten</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">Actieve projecten</h2>
          <p className="mt-2 text-slate-400">Creëer en verwijder projecten met een overzicht van status, kleur en taakcount.</p>
        </div>
        <Button variant="secondary" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nieuw project
        </Button>
      </div>

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-6" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/80 p-12 text-center text-slate-400">
          <p className="text-lg font-semibold text-slate-100">Nog geen projecten</p>
          <p className="mt-2 text-sm">Maak een nieuw project aan om direct je werkruimte te vullen.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <div key={project._id} className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-6 shadow-sm shadow-slate-950/10">
              <div className="flex items-center justify-between gap-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${colorStyles[project.color] ?? colorStyles.slate}`}>
                  {project.status.replace('-', ' ')}
                </span>
                <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-900/80" onClick={() => deleteProject(project._id)} aria-label="Delete project">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-100">{project.name}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400 line-clamp-4">{project.description || 'Geen beschrijving toegevoegd.'}</p>
              <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-400">
                <span>{project.taskCount} taken</span>
                <span className="rounded-full bg-slate-900/80 px-3 py-1">{new Date(project.createdAt).toLocaleDateString('nl-NL')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-2xl rounded-[2rem] border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4 pb-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-100">Nieuw project</h3>
                <p className="mt-2 text-sm text-slate-400">Geef een projectnaam, status en kleur op voor overzicht.</p>
              </div>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Sluiten
              </Button>
            </div>

            <div className="space-y-5">
              <label className="block text-sm text-slate-300">
                Projectnaam
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Bijv. Website redesign"
                  className="mt-2 h-12 rounded-2xl bg-slate-950/90 border-slate-800 px-4 text-slate-100"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Beschrijving
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  placeholder="Een korte samenvatting van het project..."
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/20"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Status
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as any)}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/20"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-slate-300">
                  Kleur label
                  <select
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    className="mt-2 h-12 w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-4 text-slate-100 outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-500/20"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Annuleren
              </Button>
              <Button onClick={createProject} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                {isSaving ? 'Opslaan...' : 'Project aanmaken'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
