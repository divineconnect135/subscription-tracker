"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === "register";

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    try {
      if (isRegister) {
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (!name || name.length > 100) {
          setError("Enter a valid name.");
          return;
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const { error: authError } = await authClient.signUp.email({
          name,
          email,
          password,
        });

        if (authError) {
          setError("Unable to create an account with those details.");
          return;
        }
      } else {
        const { error: authError } = await authClient.signIn.email({
          email,
          password,
        });

        if (authError) {
          setError("Invalid email or password.");
          return;
        }
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("The request could not be completed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-bold"
        >
          <Wallet className="size-7 text-brand-600" aria-hidden="true" />
          SubTracker
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            {isRegister
              ? "Start organizing recurring expenses."
              : "Log in to manage your subscriptions."}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {isRegister && (
              <Input
                id="name"
                name="name"
                label="Full name"
                placeholder="Your name"
                autoComplete="name"
                maxLength={100}
                required
                disabled={pending}
              />
            )}

            <Input
              id="email"
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={pending}
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              minLength={8}
              maxLength={128}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              disabled={pending}
            />

            {isRegister && (
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm password"
                type="password"
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                required
                disabled={pending}
              />
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Log in"}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-600">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              href={isRegister ? "/login" : "/register"}
              className="font-semibold text-brand-600 hover:underline"
            >
              {isRegister ? "Log in" : "Register"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
