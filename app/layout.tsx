import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import ErrorBoundary from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow | Modern Task Management",
  description: "A modern, secure task management platform with real-time collaboration. Manage tasks efficiently with an intuitive dashboard, built with Next.js and MongoDB.",
  keywords: ["task management", "productivity", "collaboration", "dashboard"],
  authors: [{ name: "TaskFlow" }],
  creator: "TaskFlow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taskflow.example.com",
    title: "TaskFlow | Modern Task Management",
    description: "A modern, secure task management platform with real-time collaboration.",
    siteName: "TaskFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow | Modern Task Management",
    description: "A modern, secure task management platform with real-time collaboration.",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
