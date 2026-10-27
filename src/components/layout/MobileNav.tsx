"use client";

import { useState } from "react";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/SignOutButton";
import {
  CreditCard,
  LayoutDashboard,
  Menu,
  Plus,
  Wallet,
  X,
} from "lucide-react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="border-b border-slate-200 bg-white lg:hidden">
      <div className="flex h-16 items-center justify-between px-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-slate-900"
          onClick={closeMenu}
        >
          <Wallet className="size-6 text-brand-600" aria-hidden="true" />
          SubTracker
        </Link>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          {isOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        className={
          isOpen ? "space-y-1 border-t border-slate-100 px-5 py-4" : "hidden"
        }
      >
        <Link
          href="/dashboard"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-800 hover:bg-slate-100"
        >
          <LayoutDashboard className="size-5" aria-hidden="true" />
          Dashboard
        </Link>

        <Link
          href="/subscriptions"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-800 hover:bg-slate-100"
        >
          <CreditCard className="size-5" aria-hidden="true" />
          Subscriptions
        </Link>

        <Link
          href="/subscriptions/new"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-800 hover:bg-slate-100"
        >
          <Plus className="size-5" aria-hidden="true" />
          Add subscription
        </Link>
        <div className="border-t border-slate-200 pt-3">
          <SignOutButton />
        </div>
      </nav>
    </div>
  );
}
