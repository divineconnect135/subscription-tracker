import type { ReactNode } from "react";

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
};

export function SummaryCard({
  title,
  value,
  description,
  icon,
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-600">{title}</p>

        <div className="rounded-lg bg-brand-50 p-2.5 text-brand-600">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </article>
  );
}
