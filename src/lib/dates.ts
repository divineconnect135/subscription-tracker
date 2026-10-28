const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateOnly(value: string): Date {
  if (!DATE_ONLY_PATTERN.test(value)) {
    throw new Error("Invalid date-only format");
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error("Invalid calendar date");
  }

  return date;
}

export function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getUtcToday(clock: Date = new Date()): string {
  return toDateOnly(clock);
}

export function addUtcDays(dateOnly: string, days: number): string {
  if (!Number.isInteger(days)) {
    throw new Error("Days must be an integer");
  }

  const date = parseDateOnly(dateOnly);

  date.setUTCDate(date.getUTCDate() + days);

  return toDateOnly(date);
}

export function formatDateOnly(dateOnly: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseDateOnly(dateOnly));
}

export function isWithinNextDays(
  renewalDate: string,
  today: string,
  numberOfDays = 30,
): boolean {
  if (!Number.isInteger(numberOfDays) || numberOfDays < 1) {
    throw new Error("Number of days must be a positive integer");
  }

  parseDateOnly(renewalDate);
  parseDateOnly(today);

  const lastDay = addUtcDays(today, numberOfDays - 1);

  return renewalDate >= today && renewalDate <= lastDay;
}
