import { describe, expect, it } from "vitest";

import {
  subscriptionSchema,
  subscriptionIdSchema,
} from "../../src/features/subscriptions/schema";

const validInput = {
  name: "Netflix",
  amount: "16.99",
  billingCycle: "MONTHLY",
  category: "Entertainment",
  nextRenewalDate: "2026-11-15",
  status: "ACTIVE",
  notes: "Standard plan",
};

describe("subscriptionSchema", () => {
  it("converts CAD prices into integer cents", () => {
    const result = subscriptionSchema.safeParse(validInput);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.amount).toBe(1699);
      expect(result.data.name).toBe("Netflix");
      expect(result.data.status).toBe("ACTIVE");
    }
  });

  it("trims names and converts empty notes to null", () => {
    const result = subscriptionSchema.safeParse({
      ...validInput,
      name: "  Spotify  ",
      notes: "   ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Spotify");
      expect(result.data.notes).toBeNull();
    }
  });

  it.each(["0", "-12", "abc", "12.999", ""])(
    "rejects invalid price %s",
    (amount) => {
      const result = subscriptionSchema.safeParse({
        ...validInput,
        amount,
      });

      expect(result.success).toBe(false);
    },
  );

  it("rejects prices above the application limit", () => {
    const result = subscriptionSchema.safeParse({
      ...validInput,
      amount: "1000000.01",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty and excessively long names", () => {
    expect(
      subscriptionSchema.safeParse({
        ...validInput,
        name: "  ",
      }).success,
    ).toBe(false);

    expect(
      subscriptionSchema.safeParse({
        ...validInput,
        name: "x".repeat(121),
      }).success,
    ).toBe(false);
  });

  it("rejects invalid calendar dates", () => {
    const result = subscriptionSchema.safeParse({
      ...validInput,
      nextRenewalDate: "2026-02-30",
    });

    expect(result.success).toBe(false);
  });

  it.each(["WEEKLY", "DAILY", "monthly"])(
    "rejects unsupported billing cycle %s",
    (billingCycle) => {
      expect(
        subscriptionSchema.safeParse({
          ...validInput,
          billingCycle,
        }).success,
      ).toBe(false);
    },
  );

  it.each(["EXPIRED", "UNKNOWN", "active"])(
    "rejects unsupported status %s",
    (status) => {
      expect(
        subscriptionSchema.safeParse({
          ...validInput,
          status,
        }).success,
      ).toBe(false);
    },
  );

  it("rejects unrecognized categories", () => {
    expect(
      subscriptionSchema.safeParse({
        ...validInput,
        category: "UntrustedCategory",
      }).success,
    ).toBe(false);
  });

  it("rejects notes exceeding 1000 characters", () => {
    expect(
      subscriptionSchema.safeParse({
        ...validInput,
        notes: "x".repeat(1001),
      }).success,
    ).toBe(false);
  });

  it("ignores a client-supplied userId", () => {
    const result = subscriptionSchema.safeParse({
      ...validInput,
      userId: "another-user",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(Object.prototype.hasOwnProperty.call(result.data, "userId")).toBe(
        false,
      );
    }
  });
});

describe("subscriptionIdSchema", () => {
  it("accepts valid record identifiers", () => {
    expect(subscriptionIdSchema.safeParse("record_abc-123").success).toBe(true);
  });

  it("rejects empty or malformed IDs", () => {
    expect(subscriptionIdSchema.safeParse("").success).toBe(false);

    expect(subscriptionIdSchema.safeParse("../other-record").success).toBe(
      false,
    );

    expect(subscriptionIdSchema.safeParse("x".repeat(129)).success).toBe(false);
  });
});
