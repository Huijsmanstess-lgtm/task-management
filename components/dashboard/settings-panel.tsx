"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SettingsPanelProps = {
  name: string;
  email: string;
};

export default function SettingsPanel({ name, email }: SettingsPanelProps) {
  const [displayName, setDisplayName] = useState(name);
  const [userEmail, setUserEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: displayName,
          email: userEmail,
          currentPassword,
          newPassword,
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error || 'Kon instellingen niet bijwerken.');
      }

      toast.success('Instellingen bijgewerkt.');
      setCurrentPassword('');
      setNewPassword('');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is iets misgegaan.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm('Weet je zeker dat je je account wilt verwijderen? Deze actie is permanent.');
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error || 'Kon account niet verwijderen.');
      }

      toast.success('Account verwijderd.');
      signOut({ callbackUrl: '/' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Er is iets misgegaan.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.85fr]">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Profiel</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">Account details</h2>
          <p className="mt-2 text-slate-400">Werk je naam en e-mailadres bij voor een actueel account.</p>
        </div>

        <label className="block text-sm text-slate-300">
          Weergavenaam
          <Input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Jouw naam"
            className="mt-2 h-12 rounded-2xl bg-slate-950/90 border-slate-800 px-4 text-slate-100"
          />
        </label>

        <label className="block text-sm text-slate-300">
          E-mail
          <Input
            type="email"
            value={userEmail}
            onChange={(event) => setUserEmail(event.target.value)}
            placeholder="naam@voorbeeld.nl"
            className="mt-2 h-12 rounded-2xl bg-slate-950/90 border-slate-800 px-4 text-slate-100"
          />
        </label>

        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/85 p-5">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Wachtwoord</p>
          <div className="mt-5 space-y-4">
            <label className="block text-sm text-slate-300">
              Huidig wachtwoord
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Huidig wachtwoord"
                className="mt-2 h-12 rounded-2xl bg-slate-950/90 border-slate-800 px-4 text-slate-100"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Nieuw wachtwoord
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Nieuw wachtwoord"
                className="mt-2 h-12 rounded-2xl bg-slate-950/90 border-slate-800 px-4 text-slate-100"
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="submit" disabled={saving}>
            {saving ? 'Opslaan...' : 'Opslaan'}
          </Button>
        </div>
      </form>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-rose-400/70">Danger zone</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-100">Account verwijderen</h2>
          <p className="mt-2 text-slate-400">Verwijder je account en alle bijbehorende taken en projecten permanent.</p>
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-5">
          <p className="text-sm text-slate-300">Deze actie kan niet ongedaan gemaakt worden.</p>
          <Button variant="destructive" className="mt-5 w-full" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? 'Verwijderen...' : 'Account verwijderen'}
          </Button>
        </div>
      </div>
    </div>
  );
}
