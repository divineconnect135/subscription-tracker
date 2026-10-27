import "server-only";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import type { DemoSubscription } from "./mock-data";

export async function getOwnSubscriptions(): Promise<DemoSubscription[]> {
  const user = await requireUser();

  const records = await prisma.subscription.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      amountCents: true,
      billingCycle: true,
      category: true,
      nextRenewalDate: true,
      status: true,
    },
  });

  return records.map((record) => ({
    id: record.id,
    name: record.name,
    amountCents: record.amountCents,
    currency: "CAD" as const,
    billingCycle: record.billingCycle,
    category: record.category,
    nextRenewalDate: record.nextRenewalDate.toISOString().slice(0, 10),
    status: record.status,
  }));
}
