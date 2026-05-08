"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "rounded-2xl border border-slate-800 bg-slate-950/95 text-slate-100 shadow-xl shadow-slate-950/40",
            title: "text-sm font-semibold",
            description: "text-xs text-slate-400",
            actionButton: "rounded-lg bg-sky-500 text-white hover:bg-sky-600",
            cancelButton: "rounded-lg bg-slate-800 text-slate-100",
          },
        }}
      />
    </SessionProvider>
  )
}