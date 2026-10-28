import { Suspense } from "react";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { requireUser } from "@/lib/require-user";
import { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

function SessionFallback() {
  return (
    <main
      role="status"
      className="flex min-h-screen items-center justify-center text-sm text-slate-600"
    >
      Checking your session...
    </main>
  );
}

async function ProtectedShell({ children }: { children: ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-screen lg:flex">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:text-slate-900 focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileNav />

        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<SessionFallback />}>
      <ProtectedShell>{children}</ProtectedShell>
    </Suspense>
  );
}
