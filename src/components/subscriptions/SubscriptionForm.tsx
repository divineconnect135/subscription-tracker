"use client";

import { useActionState } from "react";
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
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus:border-brand-600 focus:outline-2 focus:outline-brand-600/20";

export function SubscriptionForm({ subscription }: SubscriptionFormProps) {
  const isEditing = Boolean(subscription);

  const action = subscription
    ? updateSubscriptionAction.bind(null, subscription.id)
    : createSubscriptionAction;

  const [state, formAction, pending] = useActionState(
    action,
    initialActionState,
  );

  function fieldError(field: string) {
    return state.fieldErrors[field]?.[0];
  }

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-xl font-bold">Subscription details</h2>

        <p className="mt-2 text-sm text-slate-500">
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
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {fieldError("name")}
          </p>
        )}
      </div>

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
            <p id="amount-error" className="mt-1 text-sm text-red-600">
              {fieldError("amount")}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="billingCycle"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Billing cycle
          </label>

          <select
            id="billingCycle"
            name="billingCycle"
            defaultValue={subscription?.billingCycle ?? "MONTHLY"}
            className={selectClasses}
            disabled={pending}
            aria-invalid={Boolean(fieldError("billingCycle"))}
            required
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>

          {fieldError("billingCycle") && (
            <p className="mt-1 text-sm text-red-600">
              {fieldError("billingCycle")}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            defaultValue={subscription?.category ?? "Entertainment"}
            className={selectClasses}
            disabled={pending}
            aria-invalid={Boolean(fieldError("category"))}
            required
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {fieldError("category") && (
            <p className="mt-1 text-sm text-red-600">
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
            <p id="renewal-error" className="mt-1 text-sm text-red-600">
              {fieldError("nextRenewalDate")}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Status
        </label>

        <select
          id="status"
          name="status"
          defaultValue={subscription?.status ?? "ACTIVE"}
          className={selectClasses}
          disabled={pending}
          aria-invalid={Boolean(fieldError("status"))}
          required
        >
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        {fieldError("status") && (
          <p className="mt-1 text-sm text-red-600">{fieldError("status")}</p>
        )}

        <p className="mt-2 text-xs text-slate-500">
          Changing the status does not affect your actual subscription provider.
        </p>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="mb-2 block text-sm font-medium text-slate-700"
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
          className={selectClasses}
        />

        {fieldError("notes") && (
          <p className="mt-1 text-sm text-red-600">{fieldError("notes")}</p>
        )}
      </div>

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
          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
