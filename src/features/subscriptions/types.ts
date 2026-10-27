export type BillingCycle = "MONTHLY" | "YEARLY";

export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

export type SubscriptionView = {
  id: string;
  name: string;
  amountCents: number;
  currency: "CAD";
  billingCycle: BillingCycle;
  category: string;
  nextRenewalDate: string;
  status: SubscriptionStatus;
  notes: string | null;
};
