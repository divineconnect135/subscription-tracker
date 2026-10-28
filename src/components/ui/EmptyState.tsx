import Link from "next/link";
import { Inbox, SearchX } from "lucide-react";

import { buttonClasses } from "./Button";

type EmptyStateProps = {
  title: string;
  description: string;
  kind?: "empty" | "search";
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  kind = "empty",
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  const Icon = kind === "search" ? SearchX : Inbox;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-100">
        <Icon className="size-8 text-slate-600" aria-hidden="true" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-slate-950">{title}</h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link href={actionHref} className={`mt-7 ${buttonClasses()}`}>
          {actionLabel}
        </Link>
      )}
    </section>
  );
}
