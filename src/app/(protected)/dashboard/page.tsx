import Link from "next/link";
import { CalendarDays, CreditCard, TrendingUp, Wallet } from "lucide-react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { mockSubscriptions } from "@/features/subscriptions/mock-data";

const categories = [
  { name: "Fitness", amount: "$35.00", share: 53 },
  { name: "Entertainment", amount: "$16.99", share: 26 },
  { name: "Music", amount: "$11.99", share: 18 },
  { name: "Utilities", amount: "$2.00", share: 3 },
];

const sampleRenewals = mockSubscriptions.slice(0, 3);
const recentExamples = mockSubscriptions.slice(-3).reverse();

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-brand-600">OVERVIEW</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="mt-2 text-slate-600">
          Your recurring expenses at a glance.
        </p>

        <p className="mt-3 text-sm text-slate-500">
          Preview only — all values below are illustrative.
        </p>
      </header>

      <section
        aria-label="Example spending summary"
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="Active subscriptions"
          value="4"
          description="Example active services"
          icon={<CreditCard className="size-5" aria-hidden="true" />}
        />

        <SummaryCard
          title="Monthly spending"
          value="$65.98"
          description="Normalized monthly estimate"
          icon={<Wallet className="size-5" aria-hidden="true" />}
        />

        <SummaryCard
          title="Yearly spending"
          value="$791.76"
          description="Normalized yearly estimate"
          icon={<TrendingUp className="size-5" aria-hidden="true" />}
        />

        <SummaryCard
          title="Sample renewals"
          value="3"
          description="Illustrative renewal entries"
          icon={<CalendarDays className="size-5" aria-hidden="true" />}
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Spending by category</h2>

          <p className="mt-1 text-sm text-slate-500">
            Example monthly equivalents in CAD
          </p>

          <div className="mt-7 space-y-6">
            {categories.map((category) => (
              <div key={category.name}>
                <div className="mb-2 flex justify-between gap-4 text-sm">
                  <span className="font-medium">{category.name}</span>

                  <span className="text-slate-600">{category.amount}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{
                      width: `${category.share}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Paused and cancelled services are excluded.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Example renewal dates</h2>

          <p className="mt-1 text-sm text-slate-500">
            Fixed sample dates, not live reminders
          </p>

          <div className="mt-6 divide-y divide-slate-100">
            {sampleRenewals.map((subscription) => (
              <div
                key={subscription.id}
                className="flex items-center justify-between gap-4 py-4 first:pt-0"
              >
                <div>
                  <p className="font-semibold">{subscription.name}</p>

                  <p className="mt-1 text-xs text-slate-500">
                    {subscription.category}
                  </p>
                </div>

                <time
                  dateTime={subscription.nextRenewalDate}
                  className="text-sm text-slate-600"
                >
                  {subscription.nextRenewalDate}
                </time>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">Recent examples</h2>

            <p className="mt-1 text-sm text-slate-500">
              Sample entries in the subscription list
            </p>
          </div>

          <Link
            href="/subscriptions"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            View subscriptions
          </Link>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          {recentExamples.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="font-medium">{subscription.name}</p>

                <p className="mt-1 text-xs text-slate-500">
                  {subscription.category}
                </p>
              </div>

              <span className="text-xs font-medium text-slate-500">
                {subscription.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
