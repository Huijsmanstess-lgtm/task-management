"use client";

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type CalendarTask = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
};

function getMonthDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = 0; i < startOffset; i += 1) {
    days.push(new Date(year, month, -startOffset + i + 1));
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    const nextIndex = days.length - startOffset;
    days.push(new Date(year, month + 1, nextIndex + 1));
  }

  return days;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CalendarView() {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, CalendarTask[]> = {};
    tasks.forEach((task) => {
      const key = task.createdAt.slice(0, 10);
      groups[key] = groups[key] ? [...groups[key], task] : [task];
    });
    return groups;
  }, [tasks]);

  const monthDays = useMemo(() => getMonthDays(currentMonth), [currentMonth]);
  const selectedKey = selectedDate.toISOString().slice(0, 10);
  const selectedTasks = groupedTasks[selectedKey] ?? [];

  function shiftMonth(offset: number) {
    setCurrentMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  async function fetchTasks() {
    setLoading(true);
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
      setLoading(false);
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.8fr_0.9fr]">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Maand</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">
              {currentMonth.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => shiftMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => shiftMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.25em] text-slate-500">
          {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2 text-sm">
          {monthDays.map((day) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const key = day.toISOString().slice(0, 10);
            const count = groupedTasks[key]?.length ?? 0;
            const isSelected = key === selectedKey;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`group min-h-[90px] rounded-3xl border p-3 text-left transition ${
                  isSelected ? 'border-sky-400 bg-slate-900 shadow-slate-950/20' : 'border-slate-800 bg-slate-950/85 hover:border-slate-700 hover:bg-slate-900/90'
                } ${isCurrentMonth ? 'text-slate-100' : 'text-slate-600'} `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{day.getDate()}</span>
                  {count > 0 ? (
                    <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-sky-500/10 text-[0.65rem] uppercase tracking-[0.2em] text-sky-300">
                      {count}
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 min-h-[38px] text-xs leading-5 text-slate-400">
                  {count > 0 ? `${count} taak${count === 1 ? '' : 'en'}` : 'Leeg'}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-slate-800 bg-slate-900/90 p-5 text-sm text-slate-400">
          <p className="text-slate-200">Geselecteerde datum</p>
          <p className="mt-2 text-lg font-semibold text-slate-100">{formatDateLabel(selectedDate)}</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400/70">Taken</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-100">Taken op geselecteerde dag</h2>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            <div className="h-4 rounded-full bg-slate-800" />
            <div className="h-4 rounded-full bg-slate-800" />
            <div className="h-4 rounded-full bg-slate-800" />
          </div>
        ) : selectedTasks.length === 0 ? (
          <div className="mt-8 rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/80 p-8 text-center text-slate-400">
            <p className="text-lg font-semibold text-slate-100">Geen taken op deze datum</p>
            <p className="mt-2 text-sm">Selecteer een andere dag om taken te bekijken.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {selectedTasks.map((task) => (
              <div key={task._id} className="rounded-3xl border border-slate-800 bg-slate-900/85 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-100">{task.title}</p>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-3">{task.description || 'Geen beschrijving toegevoegd.'}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-500">{task.status.replace('-', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
