import { Suspense } from "react";
import { CalendarDays, CreditCard, TrendingUp, Wallet } from "lucide-react";

import { requireUser } from "@/lib/require-user";
import { getUtcToday } from "@/lib/dates";
import { getOwnSubscriptions } from "@/features/subscriptions/queries";

import {
  calculateCategorySpending,
  calculateSpendingSummary,
  calculateUpcomingCharges,
  formatCad,
  getUpcomingRenewals,
} from "@/features/subscriptions/calculations";

import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { SpendingOverview } from "@/components/dashboard/SpendingOverview";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { RecentSubscriptions } from "@/components/dashboard/RecentSubscriptions";

async function DashboardContent() {
  const user = await requireUser();

  const subscriptions = await getOwnSubscriptions();

  const today = getUtcToday();

  const summary = calculateSpendingSummary(subscriptions);

  const categorySpending = calculateCategorySpending(subscriptions);

  const upcomingRenewals = getUpcomingRenewals(subscriptions, today, 30);

  const upcomingChargesCents = calculateUpcomingCharges(upcomingRenewals);

  const recentSubscriptions = subscriptions.slice(0, 5);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-brand-600">
          FINANCIAL OVERVIEW
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Welcome, {user.name}
        </h1>

        <p className="mt-2 text-slate-600">
          Understand your recurring subscription spending.
        </p>

        <p className="mt-3 text-sm text-slate-500">All amounts are in CAD.</p>
      </header>

      <section
        aria-label="Spending summary"
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="Active subscriptions"
          value={String(summary.activeCount)}
          description="Currently active services"
          icon={<CreditCard className="size-5" aria-hidden="true" />}
        />

        <SummaryCard
          title="Monthly spending"
          value={formatCad(summary.monthlyCents)}
          description="Normalized monthly estimate"
          icon={<Wallet className="size-5" aria-hidden="true" />}
        />

        <SummaryCard
          title="Yearly spending"
          value={formatCad(summary.yearlyCents)}
          description="Normalized annual estimate"
          icon={<TrendingUp className="size-5" aria-hidden="true" />}
        />

        <SummaryCard
          title="Upcoming charges"
          value={formatCad(upcomingChargesCents)}
          description={`${upcomingRenewals.length} expected renewals in 30 days`}
          icon={<CalendarDays className="size-5" aria-hidden="true" />}
        />
      </section>

      <p className="text-sm leading-6 text-slate-500">
        Monthly and yearly spending are normalized estimates, not amounts
        necessarily charged in each calendar month. Upcoming charges reflect
        your saved renewal dates and billing amounts.
      </p>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <SpendingOverview categories={categorySpending} />

        <UpcomingRenewals subscriptions={upcomingRenewals} />
      </div>

      <RecentSubscriptions subscriptions={recentSubscriptions} />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600"
        >
          Loading your spending summary...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
