"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import {
  subscriptionSchema,
  subscriptionIdSchema,
  statusSchema,
} from "./schema";
import type { ActionState } from "./action-state";

function errorState(
  message: string,
  fieldErrors: Record<string, string[]> = {},
): ActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

function validationErrors(error: z.ZodError): ActionState {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field !== "string") {
      continue;
    }

    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  return errorState("Please correct the highlighted fields.", fieldErrors);
}

function readText(formData: FormData, field: string): string {
  const value = formData.get(field);

  return typeof value === "string" ? value : "";
}

function getFormValues(formData: FormData) {
  return {
    name: readText(formData, "name"),
    amount: readText(formData, "amount"),
    billingCycle: readText(formData, "billingCycle"),
    category: readText(formData, "category"),
    nextRenewalDate: readText(formData, "nextRenewalDate"),
    status: readText(formData, "status"),
    notes: readText(formData, "notes"),
  };
}

function refreshSubscriptionPages() {
  revalidatePath("/subscriptions");
  revalidatePath("/dashboard");
}

// CREATE
export async function createSubscriptionAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const parsed = subscriptionSchema.safeParse(getFormValues(formData));

  if (!parsed.success) {
    return validationErrors(parsed.error);
  }

  const data = parsed.data;

  try {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        name: data.name,
        amountCents: data.amount,
        currency: "CAD",
        billingCycle: data.billingCycle,
        category: data.category,
        nextRenewalDate: new Date(`${data.nextRenewalDate}T00:00:00.000Z`),
        status: data.status,
        notes: data.notes,
      },
    });
  } catch (error) {
    console.error("Create subscription failed:", error);

    return errorState("Unable to create the subscription. Please try again.");
  }

  refreshSubscriptionPages();
  redirect("/subscriptions?notice=created");
}

// UPDATE
export async function updateSubscriptionAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const validatedId = subscriptionIdSchema.safeParse(id);

  if (!validatedId.success) {
    return errorState("Invalid subscription identifier.");
  }

  const parsed = subscriptionSchema.safeParse(getFormValues(formData));

  if (!parsed.success) {
    return validationErrors(parsed.error);
  }

  const data = parsed.data;

  try {
    const result = await prisma.subscription.updateMany({
      where: {
        id: validatedId.data,
        userId: user.id,
      },
      data: {
        name: data.name,
        amountCents: data.amount,
        currency: "CAD",
        billingCycle: data.billingCycle,
        category: data.category,
        nextRenewalDate: new Date(`${data.nextRenewalDate}T00:00:00.000Z`),
        status: data.status,
        notes: data.notes,
      },
    });

    if (result.count === 0) {
      return errorState("Subscription not found or access denied.");
    }
  } catch (error) {
    console.error("Update subscription failed:", error);

    return errorState("Unable to update the subscription. Please try again.");
  }

  refreshSubscriptionPages();
  revalidatePath(`/subscriptions/${validatedId.data}/edit`);

  redirect("/subscriptions?notice=updated");
}

// DELETE

export async function deleteSubscriptionAction(
  id: string,
  _previousState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  void _previousState;
  void _formData;

  const user = await requireUser();

  // Keep the rest of your existing function unchanged.

  const validatedId = subscriptionIdSchema.safeParse(id);

  if (!validatedId.success) {
    return errorState("Invalid subscription identifier.");
  }

  try {
    const result = await prisma.subscription.deleteMany({
      where: {
        id: validatedId.data,
        userId: user.id,
      },
    });

    if (result.count === 0) {
      return errorState("Subscription not found or access denied.");
    }
  } catch (error) {
    console.error("Delete subscription failed:", error);

    return errorState("Unable to delete the subscription. Please try again.");
  }

  refreshSubscriptionPages();
  redirect("/subscriptions?notice=deleted");
}

// CHANGE STATUS
export async function changeSubscriptionStatusAction(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();

  const validatedId = subscriptionIdSchema.safeParse(id);
  const validatedStatus = statusSchema.safeParse(readText(formData, "status"));

  if (!validatedId.success || !validatedStatus.success) {
    return errorState("Invalid subscription or status.");
  }

  try {
    const result = await prisma.subscription.updateMany({
      where: {
        id: validatedId.data,
        userId: user.id,
      },
      data: {
        status: validatedStatus.data,
      },
    });

    if (result.count === 0) {
      return errorState("Subscription not found or access denied.");
    }
  } catch (error) {
    console.error("Status update failed:", error);

    return errorState("Unable to update the subscription status.");
  }

  refreshSubscriptionPages();

  return {
    status: "success",
    message: "Subscription status updated.",
    fieldErrors: {},
  };
}
