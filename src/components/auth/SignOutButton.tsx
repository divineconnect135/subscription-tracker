"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function handleSignOut() {
    setPending(true);
    setError(false);

    try {
      const { error: authError } = await authClient.signOut();

      if (authError) {
        setError(true);
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={pending}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-60"
      >
        <LogOut className="size-5" aria-hidden="true" />
        {pending ? "Signing out..." : "Log out"}
      </button>

      {error && (
        <p role="alert" className="px-3 text-xs text-red-600">
          Unable to sign out. Try again.
        </p>
      )}
    </div>
  );
}
