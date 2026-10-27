export type BillingCycle = "MONTHLY" | "YEARLY";

export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export type DemoSubscription = {
  id: string;
  name: string;
  amountCents: number;
  currency: "CAD";
  billingCycle: BillingCycle;
  category: string;
  nextRenewalDate: string;
  status: SubscriptionStatus;
};

export const mockSubscriptions: DemoSubscription[] = [
  {
    id: "demo-1",
    name: "Netflix",
    amountCents: 1699,
    currency: "CAD",
    billingCycle: "MONTHLY",
    category: "Entertainment",
    nextRenewalDate: "2026-11-03",
    status: "ACTIVE",
  },
  {
    id: "demo-2",
    name: "Spotify",
    amountCents: 1199,
    currency: "CAD",
    billingCycle: "MONTHLY",
    category: "Music",
    nextRenewalDate: "2026-11-12",
    status: "ACTIVE",
  },
  {
    id: "demo-3",
    name: "Gym",
    amountCents: 3500,
    currency: "CAD",
    billingCycle: "MONTHLY",
    category: "Fitness",
    nextRenewalDate: "2026-11-20",
    status: "ACTIVE",
  },
  {
    id: "demo-4",
    name: "Domain registration",
    amountCents: 2400,
    currency: "CAD",
    billingCycle: "YEARLY",
    category: "Utilities",
    nextRenewalDate: "2026-12-10",
    status: "ACTIVE",
  },
  {
    id: "demo-5",
    name: "Design tool",
    amountCents: 1499,
    currency: "CAD",
    billingCycle: "MONTHLY",
    category: "Software",
    nextRenewalDate: "2026-11-25",
    status: "PAUSED",
  },
];
