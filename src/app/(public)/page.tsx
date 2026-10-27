import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesColumn,
  CreditCard,
  Wallet,
} from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";

const features = [
  {
    title: "Track subscriptions",
    description: "Keep all recurring services and their costs in one place.",
    icon: CreditCard,
  },
  {
    title: "Understand spending",
    description: "See normalized monthly and yearly expense estimates.",
    icon: ChartNoAxesColumn,
  },
  {
    title: "Follow renewals",
    description: "Keep track of upcoming subscription renewal dates.",
    icon: CalendarDays,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-100">
        <nav
          aria-label="Public navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8"
        >
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <Wallet className="size-7 text-brand-600" aria-hidden="true" />
            SubTracker
          </Link>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-brand-600"
            >
              Log in
            </Link>

            <Link href="/register" className={`${buttonClasses()} px-3 py-2`}>
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-5 text-sm font-bold tracking-widest text-brand-600 uppercase">
              Recurring expense tracking
            </p>

            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Know where your subscription money goes.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Organize recurring expenses, understand your monthly and yearly
              spending, and keep track of upcoming renewals.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/dashboard" className={buttonClasses()}>
                Explore dashboard preview
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link href="/register" className={buttonClasses("secondary")}>
                Registration preview
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Interface preview using example data.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-canvas p-5 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">
                    Example spending overview
                  </p>
                  <h2 className="mt-1 text-xl font-bold">Your subscriptions</h2>
                </div>

                <Wallet className="size-7 text-brand-600" aria-hidden="true" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-brand-50 p-4">
                  <p className="text-xs text-slate-600">Monthly equivalent</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    $65.98
                  </p>
                </div>

                <div className="rounded-xl bg-slate-100 p-4">
                  <p className="text-xs text-slate-600">Annual equivalent</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    $791.76
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4">
                {[
                  ["Gym", "$35.00"],
                  ["Netflix", "$16.99"],
                  ["Spotify", "$11.99"],
                  ["Domain (monthly equivalent)", "$2.00"],
                ].map(([name, price]) => (
                  <div
                    key={name}
                    className="flex justify-between border-b border-slate-100 pb-3 text-sm last:border-0"
                  >
                    <span className="text-slate-600">{name}</span>
                    <span className="font-semibold">{price}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-slate-500">
                CAD · Illustrative values only
              </p>
            </div>
          </div>
        </section>

        <section className="bg-canvas px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything in one place
              </h2>

              <p className="mt-3 text-slate-600">
                A clearer view of your recurring expenses.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-white p-7"
                  >
                    <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon className="size-6" aria-hidden="true" />
                    </div>

                    <h3 className="text-lg font-bold">{feature.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-5 py-7 text-center text-sm text-slate-500">
        Subscription Tracker — Portfolio project
      </footer>
    </div>
  );
}
