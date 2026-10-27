import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { mockSubscriptions } from "@/features/subscriptions/mock-data";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-brand-600">MANAGEMENT</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Subscriptions
          </h1>

          <p className="mt-2 text-slate-600">
            View and organize your recurring expenses.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Showing {mockSubscriptions.length} example subscriptions. These are
            not saved records.
          </p>
        </div>

        <Link href="/subscriptions/new" className={buttonClasses()}>
          <Plus className="size-4" aria-hidden="true" />
          Add subscription
        </Link>
      </header>

      <section aria-label="Example subscriptions">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mockSubscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
            />
          ))}
        </div>
      </section>

      <p className="text-sm text-slate-500">
        Search, filtering, and sorting will be introduced in Phase 7. Editing
        and deleting will be implemented in Phase 5.
      </p>
    </div>
  );
}
