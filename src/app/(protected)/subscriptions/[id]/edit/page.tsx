import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { getOwnSubscription } from "@/features/subscriptions/queries";

type EditSubscriptionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSubscriptionPage({
  params,
}: EditSubscriptionPageProps) {
  const { id } = await params;

  const subscription = await getOwnSubscription(id);

  if (!subscription) {
    notFound();
  }

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
        <h1 className="text-3xl font-bold tracking-tight">Edit subscription</h1>

        <p className="mt-2 text-slate-600">Update {subscription.name}.</p>
      </header>

      <SubscriptionForm subscription={subscription} />
    </div>
  );
}
