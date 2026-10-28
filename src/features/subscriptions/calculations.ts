import type { SubscriptionView } from "./types";
import { isWithinNextDays } from "../../lib/dates";

type SpendingInput = Pick<
  SubscriptionView,
  "amountCents" | "billingCycle" | "status" | "category"
>;

export type SpendingSummary = {
  activeCount: number;
  monthlyCents: number;
  yearlyCents: number;
};

export type CategorySpending = {
  category: string;
  monthlyCents: number;
  yearlyCents: number;
  sharePercent: number;
};

const cadFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

export function formatCad(cents: number): string {
  if (!Number.isSafeInteger(cents)) {
    throw new Error("Currency value must be integer cents");
  }

  return cadFormatter.format(cents / 100);
}

export function annualEquivalentCents(
  subscription: Pick<SpendingInput, "amountCents" | "billingCycle">,
): number {
  const { amountCents, billingCycle } = subscription;

  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new Error("Invalid subscription amount");
  }

  const yearlyCents =
    billingCycle === "MONTHLY" ? amountCents * 12 : amountCents;

  if (!Number.isSafeInteger(yearlyCents)) {
    throw new Error("Annual amount exceeds safe range");
  }

  return yearlyCents;
}

export function calculateSpendingSummary(
  subscriptions: SpendingInput[],
): SpendingSummary {
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "ACTIVE",
  );

  const yearlyCents = activeSubscriptions.reduce(
    (total, subscription) => total + annualEquivalentCents(subscription),
    0,
  );

  return {
    activeCount: activeSubscriptions.length,
    yearlyCents,
    monthlyCents: Math.round(yearlyCents / 12),
  };
}

export function calculateCategorySpending(
  subscriptions: SpendingInput[],
): CategorySpending[] {
  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === "ACTIVE",
  );

  const totals = new Map<string, number>();

  for (const subscription of activeSubscriptions) {
    const previous = totals.get(subscription.category) ?? 0;

    totals.set(
      subscription.category,
      previous + annualEquivalentCents(subscription),
    );
  }

  const totalYearlyCents = Array.from(totals.values()).reduce(
    (total, value) => total + value,
    0,
  );

  return Array.from(totals.entries())
    .map(([category, yearlyCents]) => ({
      category,
      yearlyCents,
      monthlyCents: Math.round(yearlyCents / 12),
      sharePercent:
        totalYearlyCents === 0 ? 0 : (yearlyCents / totalYearlyCents) * 100,
    }))
    .sort(
      (a, b) =>
        b.yearlyCents - a.yearlyCents || a.category.localeCompare(b.category),
    );
}

export function getUpcomingRenewals(
  subscriptions: SubscriptionView[],
  today: string,
  numberOfDays = 30,
): SubscriptionView[] {
  return subscriptions
    .filter(
      (subscription) =>
        subscription.status === "ACTIVE" &&
        isWithinNextDays(subscription.nextRenewalDate, today, numberOfDays),
    )
    .sort(
      (a, b) =>
        a.nextRenewalDate.localeCompare(b.nextRenewalDate) ||
        a.id.localeCompare(b.id),
    );
}

export function calculateUpcomingCharges(
  subscriptions: SubscriptionView[],
): number {
  return subscriptions.reduce(
    (total, subscription) => total + subscription.amountCents,
    0,
  );
}
