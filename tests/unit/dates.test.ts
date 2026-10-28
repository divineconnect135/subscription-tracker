import { describe, expect, it } from "vitest";

import {
  addUtcDays,
  formatDateOnly,
  getUtcToday,
  isWithinNextDays,
  parseDateOnly,
  toDateOnly,
} from "../../src/lib/dates";

describe("parseDateOnly", () => {
  it("parses a valid calendar date", () => {
    expect(parseDateOnly("2026-11-03").toISOString()).toBe(
      "2026-11-03T00:00:00.000Z",
    );
  });

  it("rejects invalid calendar dates", () => {
    expect(() => parseDateOnly("2026-02-30")).toThrow();

    expect(() => parseDateOnly("2026-13-01")).toThrow();

    expect(() => parseDateOnly("03/11/2026")).toThrow();
  });

  it("supports leap years", () => {
    expect(toDateOnly(parseDateOnly("2028-02-29"))).toBe("2028-02-29");

    expect(() => parseDateOnly("2027-02-29")).toThrow();
  });
});

describe("addUtcDays", () => {
  it("handles month boundaries", () => {
    expect(addUtcDays("2026-10-31", 1)).toBe("2026-11-01");
  });

  it("handles year boundaries", () => {
    expect(addUtcDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("handles leap days", () => {
    expect(addUtcDays("2028-02-28", 1)).toBe("2028-02-29");
  });

  it("does not shift dates across DST changes", () => {
    expect(addUtcDays("2026-03-07", 2)).toBe("2026-03-09");
  });
});

describe("getUtcToday", () => {
  it("uses the UTC calendar date", () => {
    expect(getUtcToday(new Date("2026-10-28T23:59:59.000Z"))).toBe(
      "2026-10-28",
    );

    expect(getUtcToday(new Date("2026-10-29T00:00:00.000Z"))).toBe(
      "2026-10-29",
    );
  });
});

describe("isWithinNextDays", () => {
  it("includes both ends of the 30-day window", () => {
    expect(isWithinNextDays("2026-10-28", "2026-10-28", 30)).toBe(true);

    expect(isWithinNextDays("2026-11-26", "2026-10-28", 30)).toBe(true);
  });

  it("excludes dates outside the window", () => {
    expect(isWithinNextDays("2026-10-27", "2026-10-28", 30)).toBe(false);

    expect(isWithinNextDays("2026-11-27", "2026-10-28", 30)).toBe(false);
  });

  it("rejects invalid window lengths", () => {
    expect(() => isWithinNextDays("2026-11-01", "2026-10-28", 0)).toThrow();
  });
});

describe("formatDateOnly", () => {
  it("formats the date without a timezone shift", () => {
    expect(formatDateOnly("2026-11-03")).toBe("Nov 3, 2026");
  });
});
