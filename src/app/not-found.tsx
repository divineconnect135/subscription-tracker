import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

import { buttonClasses } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div className="w-full max-w-lg text-center">
        <FileQuestion
          className="mx-auto size-14 text-slate-500"
          aria-hidden="true"
        />

        <p className="mt-6 text-sm font-bold tracking-widest text-slate-600">
          ERROR 404
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Page not found
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          This page may have been moved, deleted, or the address may be
          incorrect.
        </p>

        <p className="mt-2 text-sm text-slate-600">
          If you were editing a subscription, it may no longer be available to
          your account.
        </p>

        <Link href="/" className={`mt-8 ${buttonClasses()}`}>
          <Home className="size-4" aria-hidden="true" />
          Return home
        </Link>
      </div>
    </main>
  );
}
