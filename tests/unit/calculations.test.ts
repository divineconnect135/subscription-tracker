import { describe, expect, it } from "vitest";

import {
  annualEquivalentCents,
  calculateCategorySpending,
  calculateSpendingSummary,
  calculateUpcomingCharges,
  formatCad,
  getUpcomingRenewals,
} from "../../src/features/subscriptions/calculations";

import type { SubscriptionView } from "../../src/features/subscriptions/types";

function subscription(
  overrides: Partial<SubscriptionView> = {},
): SubscriptionView {
  return {
    id: "test-1",
    name: "Example",
    amountCents: 1000,
    currency: "CAD",
    billingCycle: "MONTHLY",
    category: "Software",
    nextRenewalDate: "2026-11-01",
    status: "ACTIVE",
    notes: null,
    ...overrides,
  };
}

describe("annualEquivalentCents", () => {
  it("multiplies monthly amounts by 12", () => {
    expect(annualEquivalentCents(subscription({ amountCents: 1699 }))).toBe(
      20388,
    );
  });

  it("preserves annual subscription amounts", () => {
    expect(
      annualEquivalentCents(
        subscription({
          amountCents: 2400,
          billingCycle: "YEARLY",
        }),
      ),
    ).toBe(2400);
  });

  it("rejects invalid amounts", () => {
    expect(() =>
      annualEquivalentCents(subscription({ amountCents: 0 })),
    ).toThrow();

    expect(() =>
      annualEquivalentCents(subscription({ amountCents: 10.5 })),
    ).toThrow();
  });
});

describe("calculateSpendingSummary", () => {
  it("calculates normalized spending correctly", () => {
    const records = [
      subscription({
        id: "netflix",
        amountCents: 1699,
      }),
      subscription({
        id: "spotify",
        amountCents: 1199,
      }),
      subscription({
        id: "gym",
        amountCents: 3500,
      }),
      subscription({
        id: "domain",
        amountCents: 2400,
        billingCycle: "YEARLY",
      }),
    ];

    expect(calculateSpendingSummary(records)).toEqual({
      activeCount: 4,
      monthlyCents: 6598,
      yearlyCents: 79176,
    });
  });

  it("excludes paused and cancelled records", () => {
    const records = [
      subscription({
        id: "active",
        amountCents: 1000,
        status: "ACTIVE",
      }),
      subscription({
        id: "paused",
        amountCents: 5000,
        status: "PAUSED",
      }),
      subscription({
        id: "cancelled",
        amountCents: 8000,
        status: "CANCELLED",
      }),
    ];

    expect(calculateSpendingSummary(records)).toEqual({
      activeCount: 1,
      monthlyCents: 1000,
      yearlyCents: 12000,
    });
  });

  it("rounds only after aggregating yearly amounts", () => {
    const records = [
      subscription({
        id: "a",
        amountCents: 1,
        billingCycle: "YEARLY",
      }),
      subscription({
        id: "b",
        amountCents: 5,
        billingCycle: "YEARLY",
      }),
    ];

    expect(calculateSpendingSummary(records)).toEqual({
      activeCount: 2,
      yearlyCents: 6,
      monthlyCents: 1,
    });
  });

  it("returns zero totals for an empty account", () => {
    expect(calculateSpendingSummary([])).toEqual({
      activeCount: 0,
      monthlyCents: 0,
      yearlyCents: 0,
    });
  });
});

describe("calculateCategorySpending", () => {
  it("groups and sorts active spending by category", () => {
    const records = [
      subscription({
        id: "fitness",
        category: "Fitness",
        amountCents: 3500,
      }),
      subscription({
        id: "music",
        category: "Music",
        amountCents: 1199,
      }),
      subscription({
        id: "paused",
        category: "Music",
        amountCents: 9000,
        status: "PAUSED",
      }),
    ];

    const categories = calculateCategorySpending(records);

    expect(categories).toHaveLength(2);
    expect(categories[0].category).toBe("Fitness");
    expect(categories[0].monthlyCents).toBe(3500);
    expect(categories[1].category).toBe("Music");
    expect(categories[1].monthlyCents).toBe(1199);

    expect(
      categories.reduce((sum, category) => sum + category.sharePercent, 0),
    ).toBeCloseTo(100);
  });

  it("returns an empty category list when appropriate", () => {
    expect(calculateCategorySpending([])).toEqual([]);
  });
});

describe("getUpcomingRenewals", () => {
  const today = "2026-10-28";

  it("includes today and day 29, excluding day 30", () => {
    const records = [
      subscription({
        id: "today",
        nextRenewalDate: "2026-10-28",
      }),
      subscription({
        id: "last-day",
        nextRenewalDate: "2026-11-26",
      }),
      subscription({
        id: "outside",
        nextRenewalDate: "2026-11-27",
      }),
    ];

    const result = getUpcomingRenewals(records, today, 30);

    expect(result.map((item) => item.id)).toEqual(["today", "last-day"]);
  });

  it("excludes past, paused and cancelled renewals", () => {
    const records = [
      subscription({
        id: "past",
        nextRenewalDate: "2026-10-27",
      }),
      subscription({
        id: "paused",
        status: "PAUSED",
      }),
      subscription({
        id: "cancelled",
        status: "CANCELLED",
      }),
    ];

    expect(getUpcomingRenewals(records, today)).toEqual([]);
  });

  it("sorts upcoming renewals by date", () => {
    const records = [
      subscription({
        id: "later",
        nextRenewalDate: "2026-11-15",
      }),
      subscription({
        id: "earlier",
        nextRenewalDate: "2026-11-02",
      }),
    ];

    expect(getUpcomingRenewals(records, today).map((item) => item.id)).toEqual([
      "earlier",
      "later",
    ]);
  });
});

describe("calculateUpcomingCharges", () => {
  it("sums the configured renewal amounts", () => {
    const renewals = [
      subscription({
        id: "monthly",
        amountCents: 1699,
      }),
      subscription({
        id: "yearly",
        amountCents: 2400,
        billingCycle: "YEARLY",
      }),
    ];

    expect(calculateUpcomingCharges(renewals)).toBe(4099);
  });
});

describe("formatCad", () => {
  it("formats cents as Canadian dollars", () => {
    expect(formatCad(1699)).toBe("$16.99");
    expect(formatCad(0)).toBe("$0.00");
  });

  it("rejects fractional cents", () => {
    expect(() => formatCad(16.99)).toThrow();
  });
});
