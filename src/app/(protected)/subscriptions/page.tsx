import { Suspense } from "react";
import Link from "next/link";
import { Plus, SearchX } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
import { PageSkeleton } from "@/components/ui/PageSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { SubscriptionFilters } from "@/components/subscriptions/SubscriptionFilters";

import { getFilteredSubscriptions } from "@/features/subscriptions/queries";
import {
  parseSubscriptionFilters,
  type RawSearchParams,
} from "@/features/subscriptions/filters";
import { Metadata } from "next";

type SubscriptionsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

const noticeMessages: Record<string, string> = {
  created: "Subscription created successfully.",
  updated: "Subscription updated successfully.",
  deleted: "Subscription deleted successfully.",
};

export const metadata: Metadata = {
  title: "Add subscription",
};

async function SubscriptionResults({ searchParams }: SubscriptionsPageProps) {
  const params = await searchParams;

  const { filters, hasInvalidParams } = parseSubscriptionFilters(params);

  const subscriptions = await getFilteredSubscriptions(filters);

  const notice =
    typeof params.notice === "string"
      ? noticeMessages[params.notice]
      : undefined;

  const hasActiveFilters = Boolean(
    filters.q || filters.category || filters.status,
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-brand-600">MANAGEMENT</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Subscriptions
          </h1>

          <p className="mt-2 text-slate-600">
            Search, filter, and manage your recurring expenses.
          </p>
        </div>

        <Link href="/subscriptions/new" className={buttonClasses()}>
          <Plus className="size-4" aria-hidden="true" />
          Add subscription
        </Link>
      </header>

      {notice && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
        >
          {notice}
        </div>
      )}

      {hasInvalidParams && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          Some filter values in the URL were invalid and have been ignored.
        </div>
      )}

      <SubscriptionFilters key={JSON.stringify(filters)} filters={filters} />

      <div
        role="status"
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <p className="text-sm font-medium text-slate-600">
          {subscriptions.length}{" "}
          {subscriptions.length === 1 ? "subscription" : "subscriptions"} found
        </p>

        {hasActiveFilters && (
          <Link
            href="/subscriptions"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Reset search and filters
          </Link>
        )}
      </div>

      {subscriptions.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            kind="search"
            title="No matching subscriptions"
            description="Try another search term, change your filters, or clear them to view all subscriptions."
            actionHref="/subscriptions"
            actionLabel="Clear filters"
          />
        ) : (
          <EmptyState
            title="No subscriptions yet"
            description="Start tracking your recurring expenses by adding your first subscription."
            actionHref="/subscriptions/new"
            actionLabel="Add your first subscription"
          />
        )
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

export default function SubscriptionsPage({
  searchParams,
}: SubscriptionsPageProps) {
  return (
    <Suspense fallback={<PageSkeleton variant="subscriptions" />}>
      <SubscriptionResults searchParams={searchParams} />
    </Suspense>
  );
}
