import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
const directConnectionString = process.env.DATABASE_URL_UNPOOLED;

if (!connectionString || !directConnectionString) {
  throw new Error("Neon connection URLs are missing");
}

const pooledUrl = new URL(connectionString);
const directUrl = new URL(directConnectionString);

const expectedDatabase = "/neondb";

const validNeonHost =
  pooledUrl.hostname.endsWith(".neon.tech") &&
  pooledUrl.hostname.includes("-pooler.");

const sameDatabase =
  pooledUrl.pathname === expectedDatabase &&
  directUrl.pathname === expectedDatabase;

const sameEndpoint =
  pooledUrl.hostname.replace("-pooler.", ".") === directUrl.hostname;

if (
  process.env.NODE_ENV === "production" ||
  process.env.ALLOW_DEVELOPMENT_SEED !== "yes" ||
  !validNeonHost ||
  !sameDatabase ||
  !sameEndpoint
) {
  throw new Error(
    "Seed blocked. Verify the Neon development database and explicit seed permission.",
  );
}

const adapter = new PrismaNeon({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

function futureDate(daysFromToday: number): Date {
  const today = new Date();

  return new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() + daysFromToday,
    ),
  );
}

async function main() {
  const demoUser = await prisma.user.upsert({
    where: {
      email: "seed-user@subscription-tracker.invalid",
    },
    update: {
      name: "Local Development User",
    },
    create: {
      name: "Local Development User",
      email: "seed-user@subscription-tracker.invalid",
    },
  });

  const subscriptions = [
    {
      id: "seed-netflix",
      name: "Netflix",
      amountCents: 1699,
      currency: "CAD",
      billingCycle: "MONTHLY",
      category: "Entertainment",
      nextRenewalDate: futureDate(7),
      status: "ACTIVE",
    },
    {
      id: "seed-spotify",
      name: "Spotify",
      amountCents: 1199,
      currency: "CAD",
      billingCycle: "MONTHLY",
      category: "Music",
      nextRenewalDate: futureDate(14),
      status: "ACTIVE",
    },
    {
      id: "seed-gym",
      name: "Gym",
      amountCents: 3500,
      currency: "CAD",
      billingCycle: "MONTHLY",
      category: "Fitness",
      nextRenewalDate: futureDate(21),
      status: "ACTIVE",
    },
    {
      id: "seed-domain",
      name: "Domain registration",
      amountCents: 2400,
      currency: "CAD",
      billingCycle: "YEARLY",
      category: "Utilities",
      nextRenewalDate: futureDate(60),
      status: "ACTIVE",
    },
    {
      id: "seed-design",
      name: "Design tool",
      amountCents: 1499,
      currency: "CAD",
      billingCycle: "MONTHLY",
      category: "Software",
      nextRenewalDate: futureDate(10),
      status: "PAUSED",
    },
  ] as const;

  for (const subscription of subscriptions) {
    const { id, ...data } = subscription;

    await prisma.subscription.upsert({
      where: { id },
      update: {
        ...data,
        userId: demoUser.id,
      },
      create: {
        id,
        ...data,
        userId: demoUser.id,
      },
    });
  }

  const savedSubscriptions = await prisma.subscription.findMany({
    where: {
      userId: demoUser.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  console.table(
    savedSubscriptions.map((subscription) => ({
      name: subscription.name,
      amountCents: subscription.amountCents,
      billingCycle: subscription.billingCycle,
      status: subscription.status,
      nextRenewalDate: subscription.nextRenewalDate.toISOString().slice(0, 10),
    })),
  );

  console.log(
    `Seed completed: ${savedSubscriptions.length} subscriptions found.`,
  );
}

main()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
