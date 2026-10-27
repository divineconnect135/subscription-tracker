import { z } from "zod";

export const CATEGORIES = [
  "Entertainment",
  "Music",
  "Fitness",
  "Software",
  "Utilities",
  "Education",
  "Other",
] as const;

export const billingCycleSchema = z.enum(["MONTHLY", "YEARLY"]);

export const statusSchema = z.enum(["ACTIVE", "PAUSED", "CANCELLED"]);

export const subscriptionIdSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/, "Invalid subscription identifier");

export function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const year = Number(value.slice(0, 4));

  if (year < 1) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

const amountSchema = z
  .string()
  .trim()
  .regex(
    /^(?:0|[1-9]\d{0,6})(?:\.\d{1,2})?$/,
    "Enter a valid CAD amount with up to 2 decimals",
  )
  .transform((value) => {
    const [dollars, fraction = ""] = value.split(".");

    return Number(dollars) * 100 + Number(fraction.padEnd(2, "0"));
  })
  .refine(
    (amountCents) => amountCents > 0 && amountCents <= 100_000_000,
    "Amount must be between $0.01 and $1,000,000",
  );

export const subscriptionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Subscription name is required")
    .max(120, "Name must be 120 characters or fewer"),

  amount: amountSchema,

  billingCycle: billingCycleSchema,

  category: z.enum(CATEGORIES),

  nextRenewalDate: z
    .string()
    .refine(isValidDateOnly, "Enter a valid renewal date"),

  status: statusSchema,

  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be 1000 characters or fewer")
    .transform((value) => value || null),
});

export type ValidatedSubscription = z.output<typeof subscriptionSchema>;
