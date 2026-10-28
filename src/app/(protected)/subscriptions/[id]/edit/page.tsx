import { Suspense } from "react";
import Link from "next/link";
import { Plus, SearchX } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
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
  title: "Edit subscription",
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
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <SearchX
              className="mx-auto size-10 text-slate-400"
              aria-hidden="true"
            />

            <h2 className="mt-5 text-xl font-bold">
              No matching subscriptions
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Try another search term or remove some of your filters.
            </p>

            <Link
              href="/subscriptions"
              className={`mt-6 ${buttonClasses("secondary")}`}
            >
              Clear filters
            </Link>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-bold">No subscriptions yet</h2>

            <p className="mt-3 text-sm text-slate-600">
              Start tracking your recurring expenses by adding your first
              subscription.
            </p>

            <Link
              href="/subscriptions/new"
              className={`mt-6 ${buttonClasses()}`}
            >
              Add your first subscription
            </Link>
          </section>
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
    <Suspense
      fallback={
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600"
        >
          Loading your subscriptions...
        </div>
      }
    >
      <SubscriptionResults searchParams={searchParams} />
    </Suspense>
  );
}
