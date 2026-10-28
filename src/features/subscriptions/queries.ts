import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { subscriptionIdSchema } from "./schema";
import { buildSubscriptionQuery } from "./filters";

import type { SubscriptionView } from "./types";
import type { SubscriptionFilterValues } from "./filters";

type SubscriptionRow = {
  id: string;
  name: string;
  amountCents: number;
  billingCycle: "MONTHLY" | "YEARLY";
  category: string;
  nextRenewalDate: Date;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  notes: string | null;
};

function toSubscriptionView(record: SubscriptionRow): SubscriptionView {
  return {
    id: record.id,
    name: record.name,
    amountCents: record.amountCents,
    currency: "CAD",
    billingCycle: record.billingCycle,
    category: record.category,
    nextRenewalDate: record.nextRenewalDate.toISOString().slice(0, 10),
    status: record.status,
    notes: record.notes,
  };
}

// All subscriptions for the dashboard.
export async function getOwnSubscriptions(): Promise<SubscriptionView[]> {
  const user = await requireUser();

  const records = await prisma.subscription.findMany({
    where: {
      userId: user.id,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return records.map(toSubscriptionView);
}

// Filtered subscriptions for the management page.
export async function getFilteredSubscriptions(
  filters: SubscriptionFilterValues,
): Promise<SubscriptionView[]> {
  const user = await requireUser();

  const query = buildSubscriptionQuery(user.id, filters);

  const records = await prisma.subscription.findMany({
    where: query.where,
    orderBy: query.orderBy,
  });

  return records.map(toSubscriptionView);
}

// A single subscription for the edit page.
export async function getOwnSubscription(
  id: string,
): Promise<SubscriptionView | null> {
  const user = await requireUser();

  const validatedId = subscriptionIdSchema.safeParse(id);

  if (!validatedId.success) {
    return null;
  }

  const record = await prisma.subscription.findFirst({
    where: {
      id: validatedId.data,
      userId: user.id,
    },
  });

  if (!record) {
    return null;
  }

  return toSubscriptionView(record);
}
