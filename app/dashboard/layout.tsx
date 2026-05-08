import type { Metadata } from "next";
import Sidebar from "@/components/dashboard/sidebar";
import Navbar from "@/components/dashboard/navbar";

export const metadata: Metadata = {
  title: "Dashboard | Task Management",
  description: "A modern responsive dashboard layout for task management.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-3rem)] gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <Sidebar />
          <div className="flex min-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/85 shadow-2xl shadow-slate-950/20 backdrop-blur">
            <Navbar />
            <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
