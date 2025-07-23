/* src/components/common/Navbar.tsx */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Scale, Save, Share2, SunMoon, User, Bell, RotateCcw
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { animate, useMotionValue, useTransform } from "framer-motion";

import { useBuildStore, type Category } from "@/stores/buildStore";
import { showPartAddedToast } from "@/lib/showPartAddedToast";
import { cn } from "@/lib/utils";

/* categories that participate in budget calc */
const CATEGORIES: Category[] = [
  "cpu","gpu","mobo","memory","storage","cooler","case","psu","accessories",
];

/* ---------- Budget pill (builder only) ---------- */
function BudgetPill() {
  const active = useBuildStore(s => s.active);
  const candidates = useBuildStore(s => s.candidates);
  const target = useBuildStore(s => s.budgetTarget);

  const total = CATEGORIES.reduce((sum, cat) => {
    const id = active[cat];
    if (!id) return sum;
    const part = candidates[cat].find(p => p.id === id);
    return sum + (part?.price_usd ?? 0);
  }, 0);

  const mv = useMotionValue(0);
  const display = useTransform(mv, v => `$${v.toFixed(2)}`);
  React.useEffect(() => {
    const controls = animate(mv, total, { duration: 0.4 });
    return () => controls.stop();
  }, [total]);

  const pct = target ? Math.min(100, (total / target) * 100) : 0;
  const over = Boolean(target && total > target);

  return (
    <button
      aria-label="Budget summary"
      className={cn(
        "group relative flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium",
        over
          ? "border-red-500/50 bg-red-500/10 text-red-400"
          : "border-gray-600 bg-gray-700/30 text-gray-200"
      )}
      onClick={() => {
        const el = document.getElementById("budget-card");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <span>{display.get()}</span>
      {target && (
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-400">/ ${target.toFixed(0)}</span>
          <div className="h-2 w-16 overflow-hidden rounded bg-gray-700">
            <div
              className={cn(
                "h-full rounded transition-colors",
                over ? "bg-red-500" : "bg-primary"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
}

/* ---------- Compare indicator (builder only) ---------- */
function CompareIndicator() {
  const compare = useBuildStore(s => s.compare);
  return (
    <div
      aria-label="Parts in compare tray"
      className={cn(
        "relative rounded-md border border-gray-600 bg-gray-800 px-2 py-1 text-xs text-gray-300",
        compare.length > 0 && "ring-2 ring-primary"
      )}
    >
      <Scale className="mr-1 inline h-4 w-4" />
      {compare.length}
    </div>
  );
}

/* ---------- Theme toggle (global) ---------- */
function ThemeToggle() {
  return (
    <button
      aria-label="Toggle dark / light theme"
      className="rounded-md border border-gray-600 bg-gray-800 p-2 hover:bg-gray-700"
      onClick={() => document.documentElement.classList.toggle("dark")}
    >
      <SunMoon className="h-4 w-4" />
    </button>
  );
}

/* ---------- Share build (builder only) ---------- */
function ShareButton() {
  const active = useBuildStore(s => s.active);
  return (
    <button
      aria-label="Share build"
      className="rounded-md border border-gray-600 bg-gray-800 p-2 hover:bg-gray-700"
      onClick={() => {
        const hash = btoa(JSON.stringify(active));
        const url = `${location.origin}${import.meta.env.BASE_URL || "/"}builder?build=${hash}`;
        navigator.clipboard.writeText(url);
        showPartAddedToast("Share link copied", "SUMMARY", () => {});
      }}
    >
      <Share2 className="h-4 w-4" />
    </button>
  );
}

/* ---------- Save build (builder only) ---------- */
function SaveButton() {
  const saveCurrent = useBuildStore(s => s.saveCurrent);
  return (
    <button
      aria-label="Save build"
      className="rounded-md border border-gray-600 bg-gray-800 p-2 hover:bg-gray-700"
      onClick={() => {
        const name = prompt("Name this build:", "My gaming rig");
        if (name) {
          saveCurrent(name);
          showPartAddedToast("Build saved", "SUMMARY", () => {});
        }
      }}
    >
      <Save className="h-4 w-4" />
    </button>
  );
}

/* ---------- Reset build (builder only) ---------- */
function ResetButton() {
  const reset = useBuildStore(s => s.resetCurrent);
  return (
    <button
      aria-label="Reset build"
      className="rounded-md border border-gray-600 bg-gray-800 p-2 hover:bg-gray-700"
      onClick={() => {
        if (confirm("Start from scratch? This does not delete saved builds.")) {
          reset();
          showPartAddedToast("Build cleared", "CPU", () => {});
        }
      }}
    >
      <RotateCcw className="h-4 w-4" />
    </button>
  );
}

/* ---------- Account menu (global) ---------- */
function AccountMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="Account menu"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 bg-gray-800 text-sm font-medium hover:bg-gray-700"
        >
          <User className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="z-[200] w-48 rounded-md border border-gray-600 bg-gray-800 p-1 shadow-xl"
        >
          <DropdownMenu.Item
            className="cursor-pointer rounded px-2 py-1 text-sm text-gray-200 hover:bg-gray-700"
            onSelect={() => (window.location.href = "/account")}
          >
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer rounded px-2 py-1 text-sm text-gray-200 hover:bg-gray-700"
            onSelect={() =>
              window.open("https://github.com/yourrepo/discussions", "_blank")
            }
          >
            Feedback ↗︎
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/* ---------- Navbar ---------- */
export default function Navbar() {
  const { pathname } = useLocation();
  const onBuilder = pathname.startsWith("/builder");

  return (
    <header
      id="site-nav"
      className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b border-gray-700 bg-off-black/80 px-4 backdrop-blur
                 opacity-0 pointer-events-none -translate-y-10 transition-all duration-200"
    >
      {/* Brand */}
      <NavLink
        to="/"
        className="flex items-center gap-2 text-sm font-semibold text-primary"
      >
        <span className="rounded bg-primary px-1.5 py-0.5 text-xs text-white">
          PC
        </span>
        Builder
      </NavLink>

      {/* Simple nav (global) */}
      <nav className="hidden items-center gap-6 lg:flex">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium",
              isActive ? "text-primary" : "text-gray-400 hover:text-gray-200"
            )
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/builder/cpu"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium",
              isActive ? "text-primary" : "text-gray-400 hover:text-gray-200"
            )
          }
        >
          Builder
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium",
              isActive ? "text-primary" : "text-gray-400 hover:text-gray-200"
            )
          }
        >
          About
        </NavLink>
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {onBuilder && (
          <>
            <BudgetPill />
            <CompareIndicator />
            <ShareButton />
            <SaveButton />
            <ResetButton />
          </>
        )}
        <button
          aria-label="Notifications"
          className="rounded-md border border-gray-600 bg-gray-800 p-2 hover:bg-gray-700"
        >
          <Bell className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <AccountMenu />
      </div>
    </header>
  );
}
