"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Menu, Plus, Wallet, X } from "lucide-react";

import { SignOutButton } from "@/components/auth/SignOutButton";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/subscriptions",
    label: "Subscriptions",
    icon: List,
  },
  {
    href: "/subscriptions/new",
    label: "Add subscription",
    icon: Plus,
  },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  const toggleRef = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggleRef.current?.focus();
    }
  }

  return (
    <header
      onKeyDown={handleKeyDown}
      className="sticky top-0 z-40 border-b border-slate-200 bg-white lg:hidden"
    >
      <div className="flex min-h-16 items-center justify-between px-5">
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className="inline-flex items-center gap-2 font-bold text-slate-900"
        >
          <Wallet className="size-6" aria-hidden="true" />
          SubTracker
        </Link>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((previous) => !previous)}
          className="inline-flex size-11 items-center justify-center rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-100"
        >
          {open ? (
            <X className="size-5" aria-hidden="true" />
          ) : (
            <Menu className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <nav
          id={menuId}
          aria-label="Mobile navigation"
          className="border-t border-slate-200 px-5 py-4"
        >
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isCurrent = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex min-h-11 items-center gap-3",
                      "rounded-lg px-3 py-2.5",
                      "text-sm font-semibold",
                      isCurrent
                        ? "bg-slate-100 text-slate-950"
                        : "text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-slate-200 pt-3">
            <SignOutButton />
          </div>
        </nav>
      )}
    </header>
  );
}
