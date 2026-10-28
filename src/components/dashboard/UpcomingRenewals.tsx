import { formatCad } from "@/features/subscriptions/calculations";
import { formatDateOnly } from "@/lib/dates";
import type { SubscriptionView } from "@/features/subscriptions/types";

type UpcomingRenewalsProps = {
  subscriptions: SubscriptionView[];
};

export function UpcomingRenewals({ subscriptions }: UpcomingRenewalsProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Upcoming renewals</h2>

      <p className="mt-2 text-sm text-slate-500">
        Active subscriptions due within the next 30 UTC calendar days
      </p>

      {subscriptions.length === 0 ? (
        <p className="mt-8 text-sm text-slate-600">
          No active renewals are due in this period.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-slate-100">
          {subscriptions.map((subscription) => (
            <li
              key={subscription.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="font-semibold">{subscription.name}</p>

                <p className="mt-1 text-xs text-slate-500">
                  {subscription.category}
                </p>

                <time
                  dateTime={subscription.nextRenewalDate}
                  className="mt-2 block text-sm text-slate-600"
                >
                  {formatDateOnly(subscription.nextRenewalDate)}
                </time>
              </div>

              <div className="text-right">
                <p className="font-semibold tabular-nums">
                  {formatCad(subscription.amountCents)}
                </p>

                <p className="mt-1 text-xs text-slate-500">Expected charge</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs leading-5 text-slate-500">
        Renewal charges are based on your saved dates and prices. They are not
        verified with external providers.
      </p>
    </section>
  );
}
