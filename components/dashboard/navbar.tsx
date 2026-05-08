"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? session?.user?.email ?? "Team member";

  return (
    <header className="border-b border-slate-800 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-sky-400/70">
            <span>Dashboard</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-100 sm:text-3xl">
              Welkom terug, {userName}
            </h1>
            <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
              Je overzicht voor taken, projecten en teamactiviteiten in één moderne werkruimte.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search tasks"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-10 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-slate-900/80">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="whitespace-nowrap"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
