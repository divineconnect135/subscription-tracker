import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatCad } from "@/features/subscriptions/calculations";
import type { SubscriptionView } from "@/features/subscriptions/types";

type RecentSubscriptionsProps = {
  subscriptions: SubscriptionView[];
};

export function RecentSubscriptions({
  subscriptions,
}: RecentSubscriptionsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold">Recently added</h2>

        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
        >
          View all
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      {subscriptions.length === 0 ? (
        <p className="mt-8 text-sm text-slate-600">
          No subscriptions added yet.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-slate-100">
          {subscriptions.map((subscription) => (
            <li
              key={subscription.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <Link
                  href={`/subscriptions/${subscription.id}/edit`}
                  className="font-semibold hover:text-brand-600 hover:underline"
                >
                  {subscription.name}
                </Link>

                <p className="mt-1 text-xs text-slate-500">
                  {subscription.category} ·{" "}
                  {subscription.billingCycle.toLowerCase()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">
                  {formatCad(subscription.amountCents)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {subscription.status.toLowerCase()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
