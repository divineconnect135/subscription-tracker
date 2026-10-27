import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { requireUser } from "@/lib/require-user";

export default async function NewSubscriptionPage() {
  await requireUser();
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/subscriptions"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to subscriptions
      </Link>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Plus className="size-6" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold">Add a subscription</h1>

        <p className="mt-3 leading-7 text-slate-600">
          The subscription form and database integration will be implemented in
          Phase 5.
        </p>

        <p className="mt-3 text-sm text-slate-500">
          No subscription can be created or saved yet.
        </p>

        <Link
          href="/subscriptions"
          className={`mt-7 ${buttonClasses("secondary")}`}
        >
          Return to subscriptions
        </Link>
      </section>
    </div>
  );
}
