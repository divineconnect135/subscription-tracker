"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

import {
  createSubscriptionAction,
  updateSubscriptionAction,
} from "@/features/subscriptions/actions";

import { initialActionState } from "@/features/subscriptions/action-state";
import { CATEGORIES } from "@/features/subscriptions/schema";

import type { SubscriptionView } from "@/features/subscriptions/types";

type SubscriptionFormProps = {
  subscription?: SubscriptionView;
};

const selectClasses =
  "w-full min-h-11 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus-visible:border-blue-700 disabled:bg-slate-100 disabled:opacity-60";

export function SubscriptionForm({ subscription }: SubscriptionFormProps) {
  const isEditing = Boolean(subscription);

  const action = subscription
    ? updateSubscriptionAction.bind(null, subscription.id)
    : createSubscriptionAction;

  const [state, formAction, pending] = useActionState(
    action,
    initialActionState,
  );

  const formRef = useRef<HTMLFormElement>(null);

  function fieldError(field: string) {
    return state.fieldErrors[field]?.[0];
  }

  useEffect(() => {
    if (state.status !== "error") {
      return;
    }

    const firstInvalidField = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );

    firstInvalidField?.focus();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-xl font-bold">Subscription details</h2>

        <p className="mt-2 text-sm text-slate-600">
          All prices are in Canadian dollars.
        </p>
      </div>

      {state.status === "error" && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {state.message}
        </p>
      )}

      {/* Subscription name */}
      <div>
        <Input
          id="name"
          name="name"
          label="Subscription name"
          placeholder="e.g. Netflix"
          defaultValue={subscription?.name ?? ""}
          maxLength={120}
          required
          disabled={pending}
          aria-invalid={Boolean(fieldError("name"))}
          aria-describedby={fieldError("name") ? "name-error" : undefined}
        />

        {fieldError("name") && (
          <p id="name-error" className="mt-1 text-sm text-red-700">
            {fieldError("name")}
          </p>
        )}
      </div>

      {/* Price and billing cycle */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Input
            id="amount"
            name="amount"
            label="Price (CAD)"
            type="text"
            inputMode="decimal"
            placeholder="16.99"
            defaultValue={
              subscription ? (subscription.amountCents / 100).toFixed(2) : ""
            }
            required
            disabled={pending}
            aria-invalid={Boolean(fieldError("amount"))}
            aria-describedby={fieldError("amount") ? "amount-error" : undefined}
          />

          {fieldError("amount") && (
            <p id="amount-error" className="mt-1 text-sm text-red-700">
              {fieldError("amount")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="billingCycle"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Billing cycle
          </label>

          <select
            id="billingCycle"
            name="billingCycle"
            defaultValue={subscription?.billingCycle ?? "MONTHLY"}
            className={selectClasses}
            disabled={pending}
            required
            aria-invalid={Boolean(fieldError("billingCycle"))}
            aria-describedby={
              fieldError("billingCycle") ? "billingCycle-error" : undefined
            }
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>

          {fieldError("billingCycle") && (
            <p id="billingCycle-error" className="mt-1 text-sm text-red-700">
              {fieldError("billingCycle")}
            </p>
          )}
        </div>
      </div>

      {/* Category and renewal date */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-slate-800"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            defaultValue={subscription?.category ?? "Entertainment"}
            className={selectClasses}
            disabled={pending}
            required
            aria-invalid={Boolean(fieldError("category"))}
            aria-describedby={
              fieldError("category") ? "category-error" : undefined
            }
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {fieldError("category") && (
            <p id="category-error" className="mt-1 text-sm text-red-700">
              {fieldError("category")}
            </p>
          )}
        </div>

        <div>
          <Input
            id="nextRenewalDate"
            name="nextRenewalDate"
            label="Next renewal date"
            type="date"
            defaultValue={subscription?.nextRenewalDate ?? ""}
            required
            disabled={pending}
            aria-invalid={Boolean(fieldError("nextRenewalDate"))}
            aria-describedby={
              fieldError("nextRenewalDate") ? "renewal-error" : undefined
            }
          />

          {fieldError("nextRenewalDate") && (
            <p id="renewal-error" className="mt-1 text-sm text-red-700">
              {fieldError("nextRenewalDate")}
            </p>
          )}
        </div>
      </div>

      {/* Subscription status */}
      <div>
        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Status
        </label>

        <select
          id="status"
          name="status"
          defaultValue={subscription?.status ?? "ACTIVE"}
          className={selectClasses}
          disabled={pending}
          required
          aria-invalid={Boolean(fieldError("status"))}
          aria-describedby={
            fieldError("status") ? "status-hint status-error" : "status-hint"
          }
        >
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <p id="status-hint" className="mt-2 text-xs text-slate-600">
          Changing the status in this tracker does not cancel or pause the
          subscription with the actual service provider.
        </p>

        {fieldError("status") && (
          <p id="status-error" className="mt-1 text-sm text-red-700">
            {fieldError("status")}
          </p>
        )}
      </div>

      {/* Optional notes */}
      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-medium text-slate-800"
        >
          Notes (optional)
        </label>

        <textarea
          id="notes"
          name="notes"
          rows={4}
          maxLength={1000}
          placeholder="Any additional details..."
          defaultValue={subscription?.notes ?? ""}
          disabled={pending}
          aria-invalid={Boolean(fieldError("notes"))}
          aria-describedby={
            fieldError("notes") ? "notes-hint notes-error" : "notes-hint"
          }
          className={selectClasses}
        />

        <p id="notes-hint" className="mt-1 text-xs text-slate-600">
          Maximum 1,000 characters.
        </p>

        {fieldError("notes") && (
          <p id="notes-error" className="mt-1 text-sm text-red-700">
            {fieldError("notes")}
          </p>
        )}
      </div>

      {/* Form actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="submit" disabled={pending}>
          {pending
            ? "Saving..."
            : isEditing
              ? "Save changes"
              : "Add subscription"}
        </Button>

        <Link
          href="/subscriptions"
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
