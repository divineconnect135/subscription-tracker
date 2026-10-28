type PageSkeletonProps = {
  variant?: "dashboard" | "subscriptions" | "form";
};

export function PageSkeleton({ variant = "subscriptions" }: PageSkeletonProps) {
  const label =
    variant === "dashboard"
      ? "Loading dashboard..."
      : variant === "form"
        ? "Loading subscription form..."
        : "Loading subscriptions...";

  return (
    <div role="status" aria-label={label} className="space-y-8">
      <p className="text-sm font-medium text-slate-600">{label}</p>

      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className="space-y-3">
          <div className="h-7 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 max-w-full rounded bg-slate-100" />
        </div>

        {variant === "dashboard" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 rounded-2xl bg-slate-100" />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="h-72 rounded-2xl bg-slate-100" />
              <div className="h-72 rounded-2xl bg-slate-100" />
            </div>
          </>
        ) : variant === "form" ? (
          <div className="space-y-6 rounded-2xl bg-slate-100 p-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : (
          <>
            <div className="h-48 rounded-2xl bg-slate-100" />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-64 rounded-2xl bg-slate-100" />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
