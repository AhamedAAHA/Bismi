"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminNav, studentNav, parentNav } from "./nav";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { Toaster, toast } from "@/components/ui/Toast";
import { cn, initials } from "@/lib/utils";
import { apiPost } from "@/lib/api";
import { Menu, X, LogOut, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navMap = {
  ADMIN: adminNav,
  STUDENT: studentNav,
  PARENT: parentNav,
} as const;

const roleLabels = {
  ADMIN: "Admin",
  STUDENT: "Student",
  PARENT: "Parent",
} as const;

export default function DashboardShell({
  role,
  userName,
  children,
}: {
  role: "ADMIN" | "STUDENT" | "PARENT";
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const nav = navMap[role];
  const roleLabel = roleLabels[role];

  async function logout() {
    await apiPost("/api/auth/logout");
    toast.success("Logged out");
    router.push("/");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === pathname ||
    (href !== `/${href.split("/")[1]}` && pathname.startsWith(href + "/")) ||
    pathname === href;

  const current = nav.find((n) => n.href === pathname) || nav[0];

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Link href={nav[0].href} onClick={() => setOpen(false)}>
          <Logo size="sm" />
        </Link>
      </div>
      <div className="mx-3 mb-3 rounded-2xl border border-[var(--border)] bg-white/[0.03] px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
          {roleLabel} Window
        </p>
        <p className="truncate text-sm font-semibold text-[var(--text)]">{userName}</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {nav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
                active
                  ? "bg-white/[0.08] text-accent-400 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.26),0_18px_36px_-28px_rgba(103,232,249,0.9)]"
                  : "text-muted hover:bg-white/[0.05] hover:text-[var(--text)]"
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" style={{ width: 18, height: 18 }} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-3">
        <button onClick={logout} className="btn btn-ghost w-full justify-start text-rose-500">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Toaster />

      {/* Desktop sidebar */}
      <aside className="glass-strong fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-[var(--border)] lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="glass-strong fixed left-0 top-0 z-50 h-screen w-72 max-w-[86vw] border-r border-[var(--border)] lg:hidden"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-rose-500"
              >
                <X className="h-5 w-5" />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:pl-72">
        {/* Navbar */}
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[#050914]/80 px-4 py-3 backdrop-blur-2xl sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden min-w-0 items-center gap-1.5 text-sm text-muted sm:flex">
                <span className="shrink-0">{roleLabel}</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
                <span className="truncate font-semibold text-[var(--text)]">{current.label}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <ThemeToggle />
              <div className="flex min-w-0 items-center gap-2.5 rounded-full border border-[var(--border)] bg-white/[0.03] px-2.5 py-1.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-brand-500 text-xs font-extrabold text-[#03111f]">
                  {initials(userName)}
                </div>
                <div className="hidden leading-tight sm:block">
                  <p className="max-w-[120px] truncate text-sm font-semibold">{userName}</p>
                  <p className="text-[11px] text-muted">{roleLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:py-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
