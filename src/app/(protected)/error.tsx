"use client";

import { ErrorPanel } from "@/components/ui/ErrorPanel";

export default function ProtectedError({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <ErrorPanel
      title="Unable to load your data"
      description="Your subscription information is temporarily unavailable. Your saved records have not been changed by this page-loading error."
      onRetry={retry}
      backHref="/dashboard"
      backLabel="Back to dashboard"
    />
  );
}
