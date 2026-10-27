"use client";

import { useActionState } from "react";

import { changeSubscriptionStatusAction } from "@/features/subscriptions/actions";
import { initialActionState } from "@/features/subscriptions/action-state";
import type { SubscriptionStatus } from "@/features/subscriptions/types";

type Props = {
  id: string;
  status: SubscriptionStatus;
};

export function SubscriptionStatusControl({ id, status }: Props) {
  const action = changeSubscriptionStatusAction.bind(null, id);

  const [state, formAction, pending] = useActionState(
    action,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-2">
      <label
        htmlFor={`status-${id}`}
        className="block text-xs font-medium text-slate-600"
      >
        Change status
      </label>

      <div className="flex flex-wrap gap-2">
        <select
          key={status}
          id={`status-${id}`}
          name="status"
          defaultValue={status}
          disabled={pending}
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Apply"}
        </button>
      </div>

      {state.status !== "idle" && (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "error"
              ? "text-xs text-red-600"
              : "text-xs text-emerald-700"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
