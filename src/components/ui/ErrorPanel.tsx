"use client";

import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";

import { Button, buttonClasses } from "./Button";

type ErrorPanelProps = {
  title: string;
  description: string;
  onRetry: () => void;
  backHref?: string;
  backLabel?: string;
};

export function ErrorPanel({
  title,
  description,
  onRetry,
  backHref = "/",
  backLabel = "Back to home",
}: ErrorPanelProps) {
  return (
    <section
      role="alert"
      className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
    >
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="size-7 text-red-700" aria-hidden="true" />
      </div>

      <h1 className="mt-5 text-2xl font-bold text-slate-950">{title}</h1>

      <p className="mt-3 leading-7 text-slate-600">{description}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" onClick={onRetry}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>

        <Link href={backHref} className={buttonClasses("secondary")}>
          {backLabel}
        </Link>
      </div>
    </section>
  );
}
