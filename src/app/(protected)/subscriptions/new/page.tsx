import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";

export const metadata: Metadata = {
  title: "Add subscription",
};

export default function NewSubscriptionPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/subscriptions"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to subscriptions
      </Link>

      <header className="my-8">
        <h1 className="text-3xl font-bold tracking-tight">Add subscription</h1>

        <p className="mt-2 text-slate-600">
          Add a recurring expense to your tracker.
        </p>
      </header>

      <SubscriptionForm />
    </div>
  );
}
