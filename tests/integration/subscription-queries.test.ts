import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireUser: vi.fn(),
  findMany: vi.fn(),
  findFirst: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/require-user", () => ({
  requireUser: mocks.requireUser,
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    subscription: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
    },
  },
}));

import {
  getOwnSubscription,
  getOwnSubscriptions,
  getFilteredSubscriptions,
} from "../../src/features/subscriptions/queries";

import { parseSubscriptionFilters } from "../../src/features/subscriptions/filters";

const testRecord = {
  id: "record-a",
  name: "Netflix",
  amountCents: 1699,
  billingCycle: "MONTHLY",
  category: "Entertainment",
  nextRenewalDate: new Date("2026-11-15T00:00:00.000Z"),
  status: "ACTIVE",
  notes: null,
};

beforeEach(() => {
  vi.clearAllMocks();

  mocks.requireUser.mockResolvedValue({
    id: "account-a",
  });

  mocks.findMany.mockResolvedValue([testRecord]);
  mocks.findFirst.mockResolvedValue(testRecord);
});

describe("subscription read authorization", () => {
  it("restricts the dashboard query to the current user", async () => {
    const results = await getOwnSubscriptions();

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: "account-a",
        },
      }),
    );

    expect(results[0].amountCents).toBe(1699);
    expect(results[0].nextRenewalDate).toBe("2026-11-15");
  });

  it("keeps ownership in filtered queries", async () => {
    const { filters } = parseSubscriptionFilters({
      q: "net",
      status: "ACTIVE",
    });

    await getFilteredSubscriptions(filters);

    expect(mocks.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "account-a",
          status: "ACTIVE",
          name: {
            contains: "net",
            mode: "insensitive",
          },
        }),
      }),
    );
  });

  it("restricts individual reads by record ID and owner", async () => {
    await getOwnSubscription("record-a");

    expect(mocks.findFirst).toHaveBeenCalledWith({
      where: {
        id: "record-a",
        userId: "account-a",
      },
    });
  });

  it("returns null for a record not owned by the user", async () => {
    mocks.findFirst.mockResolvedValueOnce(null);

    const result = await getOwnSubscription("foreign-record");

    expect(result).toBeNull();
  });

  it("rejects invalid IDs before querying", async () => {
    const result = await getOwnSubscription("../secret");

    expect(result).toBeNull();
    expect(mocks.findFirst).not.toHaveBeenCalled();
  });

  it("does not query when authentication fails", async () => {
    mocks.requireUser.mockRejectedValueOnce(new Error("Not authenticated"));

    await expect(getOwnSubscriptions()).rejects.toThrow("Not authenticated");

    expect(mocks.findMany).not.toHaveBeenCalled();
  });
});
