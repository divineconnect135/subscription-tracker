import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { getOwnSubscription } from "@/features/subscriptions/queries";

export const metadata: Metadata = {
  title: "Edit subscription",
};

type EditSubscriptionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function EditSubscriptionContent({ params }: EditSubscriptionPageProps) {
  const { id } = await params;

  const subscription = await getOwnSubscription(id);

  if (!subscription) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to subscriptions
        </Link>

        <p className="mt-6 text-sm font-semibold text-brand-600">MANAGEMENT</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Edit subscription
        </h1>

        <p className="mt-2 text-slate-600">
          Update the details for {subscription.name}.
        </p>
      </header>

      <SubscriptionForm subscription={subscription} />
    </div>
  );
}

export default function EditSubscriptionPage({
  params,
}: EditSubscriptionPageProps) {
  return (
    <Suspense fallback={<PageSkeleton variant="form" />}>
      <EditSubscriptionContent params={params} />
    </Suspense>
  );
}
