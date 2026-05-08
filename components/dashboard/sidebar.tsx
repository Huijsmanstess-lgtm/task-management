"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Home,
  ListChecks,
  Menu,
  Settings,
  SquareStack,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Tasks", href: "/dashboard/tasks", icon: ListChecks },
  { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { label: "Projects", href: "/dashboard/projects", icon: SquareStack },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="relative z-10">
      <div className="rounded-[2rem] border border-slate-800 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/15 backdrop-blur lg:h-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-sky-400/70">TaskFlow</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-50">Team Workspace</h2>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <div
          className={`mt-8 space-y-1 transition-[max-height] duration-300 ease-in-out lg:max-h-none ${
            open ? "max-h-96" : "max-h-0 overflow-hidden lg:max-h-none"
          }`}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-900/80 hover:text-slate-100"
              >
                <Icon className="h-4 w-4 text-sky-400" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-slate-300">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-sky-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-100">Premium plan</p>
              <p className="text-xs text-slate-500">5 seats used of 10</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-950/80 px-3 py-3 text-sm text-slate-400">
            Keep your team aligned with tasks, calendars and project goals in one place.
          </div>
        </div>
      </div>
    </aside>
  );
}
