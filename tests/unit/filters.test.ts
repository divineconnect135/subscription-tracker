import { describe, expect, it } from "vitest";

import {
  buildSubscriptionQuery,
  escapeLikePattern,
  parseSubscriptionFilters,
} from "../../src/features/subscriptions/filters";

describe("parseSubscriptionFilters", () => {
  it("provides defaults for an empty URL", () => {
    const result = parseSubscriptionFilters({});

    expect(result).toEqual({
      filters: {
        q: "",
        category: "",
        status: "",
        sort: "newest",
      },
      hasInvalidParams: false,
    });
  });

  it("accepts combined valid filters", () => {
    const result = parseSubscriptionFilters({
      q: "  netFLIX  ",
      category: "Entertainment",
      status: "ACTIVE",
      sort: "price-asc",
    });

    expect(result.filters).toEqual({
      q: "netFLIX",
      category: "Entertainment",
      status: "ACTIVE",
      sort: "price-asc",
    });

    expect(result.hasInvalidParams).toBe(false);
  });

  it("rejects invalid status values", () => {
    const result = parseSubscriptionFilters({
      status: "UNKNOWN",
    });

    expect(result.filters.status).toBe("");
    expect(result.hasInvalidParams).toBe(true);
  });

  it("preserves valid filters when one is invalid", () => {
    const result = parseSubscriptionFilters({
      q: "spotify",
      category: "Invalid category",
      status: "PAUSED",
      sort: "price-desc",
    });

    expect(result.filters).toEqual({
      q: "spotify",
      category: "",
      status: "PAUSED",
      sort: "price-desc",
    });

    expect(result.hasInvalidParams).toBe(true);
  });

  it("rejects unknown sorting fields", () => {
    const result = parseSubscriptionFilters({
      sort: "userId",
    });

    expect(result.filters.sort).toBe("newest");
    expect(result.hasInvalidParams).toBe(true);
  });

  it("rejects repeated parameters", () => {
    const result = parseSubscriptionFilters({
      status: ["ACTIVE", "CANCELLED"],
    });

    expect(result.filters.status).toBe("");
    expect(result.hasInvalidParams).toBe(true);
  });

  it("limits search queries to 120 characters", () => {
    const result = parseSubscriptionFilters({
      q: "a".repeat(121),
    });

    expect(result.filters.q).toBe("");
    expect(result.hasInvalidParams).toBe(true);
  });
});

describe("escapeLikePattern", () => {
  it("escapes PostgreSQL pattern wildcards", () => {
    expect(escapeLikePattern("50%_off")).toBe("50\\%\\_off");
  });

  it("keeps ordinary search terms unchanged", () => {
    expect(escapeLikePattern("netflix")).toBe("netflix");
  });
});

describe("buildSubscriptionQuery", () => {
  it("always restricts results to the user", () => {
    const { filters } = parseSubscriptionFilters({});

    const query = buildSubscriptionQuery("user-123", filters);

    expect(query.where).toEqual({
      userId: "user-123",
    });
  });

  it("combines name, category and status", () => {
    const { filters } = parseSubscriptionFilters({
      q: "net",
      category: "Entertainment",
      status: "ACTIVE",
      sort: "price-asc",
    });

    const query = buildSubscriptionQuery("user-123", filters);

    expect(query.where).toEqual({
      userId: "user-123",
      name: {
        contains: "net",
        mode: "insensitive",
      },
      category: "Entertainment",
      status: "ACTIVE",
    });

    expect(query.orderBy).toEqual([{ amountCents: "asc" }, { id: "asc" }]);
  });

  it("sorts renewal dates in ascending order", () => {
    const { filters } = parseSubscriptionFilters({
      sort: "renewal-asc",
    });

    const query = buildSubscriptionQuery("user-123", filters);

    expect(query.orderBy).toEqual([{ nextRenewalDate: "asc" }, { id: "asc" }]);
  });

  it("sorts prices in descending order", () => {
    const { filters } = parseSubscriptionFilters({
      sort: "price-desc",
    });

    const query = buildSubscriptionQuery("user-123", filters);

    expect(query.orderBy).toEqual([{ amountCents: "desc" }, { id: "asc" }]);
  });

  it("defaults to recently added", () => {
    const { filters } = parseSubscriptionFilters({});

    const query = buildSubscriptionQuery("user-123", filters);

    expect(query.orderBy).toEqual([{ createdAt: "desc" }, { id: "desc" }]);
  });
});
