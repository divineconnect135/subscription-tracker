import Link from "next/link";
import { CalendarDays, Pencil, Repeat2 } from "lucide-react";

import type {
  SubscriptionView,
  SubscriptionStatus,
} from "@/features/subscriptions/types";
import { SubscriptionStatusControl } from "./SubscriptionStatusControl";
import { DeleteSubscriptionButton } from "./DeleteSubscriptionButton";

type SubscriptionCardProps = {
  subscription: SubscriptionView;
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
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="wrap-break-word text-lg font-bold">
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

        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Repeat2 className="size-4" aria-hidden="true" />

          {subscription.billingCycle === "MONTHLY"
            ? "Billed monthly"
            : "Billed yearly"}
        </p>

        <p className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays className="size-4" aria-hidden="true" />
          Renews:
          <time dateTime={subscription.nextRenewalDate}>
            {subscription.nextRenewalDate}
          </time>
        </p>

        {subscription.notes && (
          <p className="mt-4 text-sm leading-6 text-slate-500">
            {subscription.notes}
          </p>
        )}
      </div>

      <div className="mt-auto space-y-4 pt-6">
        <Link
          href={`/subscriptions/${subscription.id}/edit`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
        >
          <Pencil className="size-4" aria-hidden="true" />
          Edit subscription
        </Link>

        <SubscriptionStatusControl
          id={subscription.id}
          status={subscription.status}
        />

        <DeleteSubscriptionButton
          id={subscription.id}
          name={subscription.name}
        />
      </div>
    </article>
  );
}
