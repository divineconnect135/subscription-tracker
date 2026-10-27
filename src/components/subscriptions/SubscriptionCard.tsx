import { CalendarDays, Repeat2 } from "lucide-react";
import type {
  DemoSubscription,
  SubscriptionStatus,
} from "@/features/subscriptions/mock-data";

type SubscriptionCardProps = {
  subscription: DemoSubscription;
};

const statusStyles: Record<SubscriptionStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  PAUSED: "bg-amber-50 text-amber-800",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(subscription.amountCents / 100);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {subscription.name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">{subscription.category}</p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[subscription.status]}`}
        >
          {subscription.status}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-2xl font-bold">{formattedPrice}</p>

        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <Repeat2 className="size-4" aria-hidden="true" />

          {subscription.billingCycle === "MONTHLY"
            ? "Billed monthly"
            : "Billed yearly"}
        </p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays className="size-4" aria-hidden="true" />
          Example renewal:
          <time dateTime={subscription.nextRenewalDate}>
            {subscription.nextRenewalDate}
          </time>
        </p>
      </div>
    </article>
  );
}
