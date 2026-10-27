import Link from "next/link";
import { CreditCard, TrendingUp, Wallet } from "lucide-react";

import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { requireUser } from "@/lib/require-user";
import { getOwnSubscriptions } from "@/features/subscriptions/queries";

export default async function DashboardPage() {
  const user = await requireUser();
  const subscriptions = await getOwnSubscriptions();

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "ACTIVE",
  );

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-brand-600">OVERVIEW</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Welcome, {user.name}
        </h1>

        <p className="mt-2 text-slate-600">
          Your personal subscription dashboard.
        </p>
      </header>

      <section
        aria-label="Subscription summary"
        className="grid gap-5 md:grid-cols-2"
      >
        <SummaryCard
          title="Total subscriptions"
          value={String(subscriptions.length)}
          description="Subscriptions belonging to your account"
          icon={<CreditCard className="size-5" aria-hidden="true" />}
        />

        <SummaryCard
          title="Active subscriptions"
          value={String(activeSubscriptions.length)}
          description="Subscriptions currently marked active"
          icon={<Wallet className="size-5" aria-hidden="true" />}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <TrendingUp className="size-6 text-brand-600" aria-hidden="true" />

          <h2 className="text-xl font-bold">Spending overview</h2>
        </div>

        <p className="mt-4 leading-7 text-slate-600">
          Monthly spending, yearly spending, category breakdowns, and renewal
          summaries will be implemented in Phase 6.
        </p>

        <Link
          href="/subscriptions"
          className="mt-6 inline-block text-sm font-semibold text-brand-600 hover:underline"
        >
          View your subscriptions
        </Link>
      </section>
    </div>
  );
}
