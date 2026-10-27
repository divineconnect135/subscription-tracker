import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { subscriptionIdSchema } from "./schema";
import type { SubscriptionView } from "./types";

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

export async function getOwnSubscriptions(): Promise<SubscriptionView[]> {
  const user = await requireUser();

  const records = await prisma.subscription.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return records.map(toSubscriptionView);
}

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
