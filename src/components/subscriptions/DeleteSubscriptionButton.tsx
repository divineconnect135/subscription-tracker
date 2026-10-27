"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";

import { deleteSubscriptionAction } from "@/features/subscriptions/actions";
import { initialActionState } from "@/features/subscriptions/action-state";

type Props = {
  id: string;
  name: string;
};

export function DeleteSubscriptionButton({ id, name }: Props) {
  const action = deleteSubscriptionAction.bind(null, id);

  const [state, formAction, pending] = useActionState(
    action,
    initialActionState,
  );

  return (
    <details className="group border-t border-slate-100 pt-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600">
        <Trash2 className="size-4" aria-hidden="true" />
        Delete subscription
      </summary>

      <div className="mt-3 rounded-lg bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-900">Delete {name}?</p>

        <p className="mt-2 text-sm text-red-800">
          This will permanently remove the record from your tracker. It will not
          cancel the external service.
        </p>

        <form action={formAction} className="mt-4">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
          >
            {pending ? "Deleting..." : "Yes, delete subscription"}
          </button>
        </form>

        <p className="mt-2 text-xs text-red-700">
          To cancel, select Delete subscription again to close this
          confirmation.
        </p>

        {state.status === "error" && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {state.message}
          </p>
        )}
      </div>
    </details>
  );
}
