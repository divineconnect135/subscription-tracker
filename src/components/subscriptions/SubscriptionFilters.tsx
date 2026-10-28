import Link from "next/link";
import { Search, RotateCcw } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";
import { CATEGORIES } from "@/features/subscriptions/schema";
import {
  SORT_OPTIONS,
  type SubscriptionFilterValues,
} from "@/features/subscriptions/filters";

type SubscriptionFiltersProps = {
  filters: SubscriptionFilterValues;
};

const inputClasses = [
  "w-full rounded-lg border border-slate-300",
  "bg-white px-3.5 py-2.5 text-sm text-slate-900",
  "focus:border-brand-600 focus:outline-2",
  "focus:outline-brand-600/20",
].join(" ");

export function SubscriptionFilters({ filters }: SubscriptionFiltersProps) {
  return (
    <form
      method="GET"
      action="/subscriptions"
      role="search"
      aria-label="Search and filter subscriptions"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label
            htmlFor="subscription-search"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Search by name
          </label>

          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />

            <input
              id="subscription-search"
              name="q"
              type="search"
              placeholder="Search subscriptions..."
              defaultValue={filters.q}
              maxLength={120}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="subscription-category"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="subscription-category"
            name="category"
            defaultValue={filters.category}
            className={inputClasses}
          >
            <option value="">All categories</option>

            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="subscription-status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="subscription-status"
            name="status"
            defaultValue={filters.status}
            className={inputClasses}
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="lg:col-span-2">
          <label
            htmlFor="subscription-sort"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Sort by
          </label>

          <select
            id="subscription-sort"
            name="sort"
            defaultValue={filters.sort}
            className={inputClasses}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
        <button type="submit" className={buttonClasses()}>
          <Search className="size-4" aria-hidden="true" />
          Apply filters
        </button>

        <Link href="/subscriptions" className={buttonClasses("secondary")}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Clear filters
        </Link>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Filters are saved in the page URL. Price sorting uses billed amounts,
        not normalized monthly costs.
      </p>
    </form>
  );
}
