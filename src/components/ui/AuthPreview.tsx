import Link from "next/link";
import { Wallet } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type AuthPreviewProps = {
  mode: "login" | "register";
};

export function AuthPreview({ mode }: AuthPreviewProps) {
  const isRegister = mode === "register";

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-bold text-slate-900"
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
              ? "Registration interface preview"
              : "Sign-in interface preview"}
          </p>

          <p
            role="status"
            className="mt-6 rounded-lg bg-brand-50 p-3 text-sm text-slate-700"
          >
            Authentication is not connected yet. This interface will become
            functional in Phase 4.
          </p>

          <fieldset disabled className="mt-7 space-y-5">
            {isRegister && (
              <Input
                id="name"
                name="name"
                label="Full name"
                placeholder="Your name"
                autoComplete="name"
              />
            )}

            <Input
              id="email"
              name="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />

            <Button disabled className="w-full">
              {isRegister ? "Create account" : "Log in"}
            </Button>
          </fieldset>

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
