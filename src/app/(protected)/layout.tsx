import { Suspense } from "react";
import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { requireUser } from "@/lib/require-user";

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
      <Sidebar />

      <div className="min-w-0 flex-1">
        <MobileNav />

        <main
          id="main-content"
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
