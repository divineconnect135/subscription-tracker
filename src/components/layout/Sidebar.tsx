import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  LayoutDashboard,
  Plus,
  Wallet,
} from "lucide-react";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
  },
  {
    href: "/subscriptions/new",
    label: "Add subscription",
    icon: Plus,
  },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-slate-950 px-4 py-6 text-white lg:flex">
      <Link href="/" className="mb-10 flex items-center gap-3 px-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand-600">
          <Wallet className="size-5" aria-hidden="true" />
        </span>

        <span className="text-lg font-bold">SubTracker</span>
      </Link>

      <nav aria-label="Main navigation" className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              <Icon className="size-5" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="px-3 text-xs text-slate-400">Interface preview</p>

        <Link
          href="/"
          className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to website
        </Link>
      </div>
    </aside>
  );
}
