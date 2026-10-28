import {
  formatCad,
  type CategorySpending,
} from "@/features/subscriptions/calculations";

type SpendingOverviewProps = {
  categories: CategorySpending[];
};

export function SpendingOverview({ categories }: SpendingOverviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Spending by category</h2>

      <p className="mt-2 text-sm text-slate-500">
        Normalized monthly spending in CAD
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 text-sm text-slate-600">
          No active subscription spending to display.
        </p>
      ) : (
        <ul className="mt-8 space-y-6">
          {categories.map((item) => (
            <li key={item.category}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium">{item.category}</span>

                <span className="text-sm font-semibold tabular-nums">
                  {formatCad(item.monthlyCents)}
                </span>
              </div>

              <div
                className="h-2 overflow-hidden rounded-full bg-slate-100"
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-full bg-brand-600"
                  style={{
                    width: `${item.sharePercent}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {item.sharePercent.toFixed(1)}% of normalized spending
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-xs leading-5 text-slate-500">
        Paused and cancelled subscriptions are excluded. Monthly category
        amounts are rounded independently.
      </p>
    </section>
  );
}
