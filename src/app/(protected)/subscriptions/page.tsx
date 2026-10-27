import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { getOwnSubscriptions } from "@/features/subscriptions/queries";

export default async function SubscriptionsPage() {
  const subscriptions = await getOwnSubscriptions();

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-brand-600">MANAGEMENT</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Subscriptions
          </h1>

          <p className="mt-2 text-slate-600">Your recurring expenses.</p>

          <p className="mt-3 text-sm text-slate-500">
            {subscriptions.length} subscriptions in your account.
          </p>
        </div>

        <Link href="/subscriptions/new" className={buttonClasses()}>
          <Plus className="size-4" aria-hidden="true" />
          Add subscription
        </Link>
      </header>

      {subscriptions.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="text-xl font-bold">No subscriptions yet</h2>

          <p className="mt-3 text-sm text-slate-600">
            Your account is ready. Subscription creation will become available
            in Phase 5.
          </p>
        </section>
      ) : (
        <section aria-label="Your subscriptions">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
