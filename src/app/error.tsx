"use client";

import { ErrorPanel } from "@/components/ui/ErrorPanel";

export default function AppError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <ErrorPanel
        title="Something went wrong"
        description="We couldn't load this page. Please try again."
        onRetry={retry}
        backHref="/"
        backLabel="Go to home"
      />
    </main>
  );
}
