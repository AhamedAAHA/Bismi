"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminNav, studentNav, parentNav } from "./nav";
import Logo from "@/components/Logo";
import OrbitalScene from "@/components/3d/OrbitalScene";
import { Toaster, toast } from "@/components/ui/Toast";
import { cn, initials } from "@/lib/utils";
import { apiPost } from "@/lib/api";
import { Menu, X, LogOut, ChevronRight, Bot, Send, Sparkles } from "lucide-react";
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
  const [quickAiOpen, setQuickAiOpen] = useState(false);
  const [quickAiInput, setQuickAiInput] = useState("");
  const [quickAiLoading, setQuickAiLoading] = useState(false);
  const [quickAiMessages, setQuickAiMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([
    { role: "ai", text: "Hi! I am BISMI AI Assistant. Ask me about homework, tests, attendance, or notes." },
  ]);
  const nav = navMap[role];
  const roleLabel = roleLabels[role];
  const quickEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    quickEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [quickAiMessages, quickAiLoading]);

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

  async function askQuickAI() {
    const q = quickAiInput.trim();
    if (!q || quickAiLoading || role !== "STUDENT") return;
    setQuickAiMessages((m) => [...m, { role: "user", text: q }]);
    setQuickAiInput("");
    setQuickAiLoading(true);
    const res = await apiPost("/api/student/assistant", { message: q });
    setQuickAiLoading(false);
    const reply =
      res.ok && typeof res.data?.answer === "string" && res.data.answer.trim()
        ? res.data.answer
        : res.error || "I could not generate a clear answer. Please try again.";
    setQuickAiMessages((m) => [
      ...m,
      { role: "ai", text: reply },
    ]);
  }

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
      {role === "STUDENT" && (
        <div className="px-3 pb-3">
          <button
            onClick={() => {
              setQuickAiOpen(true);
              setOpen(false);
            }}
            className="w-full rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-left text-cyan-200 transition hover:bg-cyan-400/20"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Bot className="h-4 w-4" />
              Ask AI
            </span>
          </button>
        </div>
      )}
      <div className="border-t border-[var(--border)] p-3">
        <button onClick={logout} className="btn btn-ghost w-full justify-start text-rose-500">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <OrbitalScene opacity={0.2} />
      <Toaster />

      {/* Desktop sidebar */}
      <aside className="glass-strong !fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-[var(--border)] lg:block">
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
              className="glass-strong !fixed left-0 top-0 z-50 h-screen w-72 max-w-[86vw] border-r border-[var(--border)] lg:hidden"
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

      {/* Student quick AI drawer */}
      {role === "STUDENT" && (
        <AnimatePresence>
          {quickAiOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
                onClick={() => setQuickAiOpen(false)}
              />
              <motion.aside
                initial={{ x: 420, opacity: 0.7 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 420, opacity: 0.7 }}
                transition={{ type: "tween", duration: 0.25 }}
                className="fixed bottom-0 right-0 z-[60] flex h-[80vh] w-full flex-col rounded-t-2xl border border-cyan-400/20 bg-slate-900/60 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl sm:h-[88vh] sm:max-h-[720px] sm:w-[420px] sm:rounded-none sm:border-l sm:border-t-0"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-cyan-200">BISMI AI Assistant</p>
                    <p className="text-xs text-muted">Quick student help</p>
                  </div>
                  <button
                    onClick={() => setQuickAiOpen(false)}
                    className="rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-white"
                    aria-label="Close AI assistant"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
                  {quickAiMessages.map((m, i) => (
                    <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed",
                          m.role === "user"
                            ? "bg-cyan-500 text-[#03111f]"
                            : "border border-white/10 bg-white/5 text-[var(--text)]"
                        )}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {quickAiLoading && (
                    <div className="flex justify-start">
                      <div className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted">
                        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                        Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={quickEndRef} />
                </div>

                <div className="border-t border-white/10 px-4 py-3">
                  <div className="flex gap-2">
                    <input
                      className="input bg-slate-900/40"
                      placeholder="Ask about homework, tests, attendance, or notes..."
                      value={quickAiInput}
                      onChange={(e) => setQuickAiInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && askQuickAI()}
                    />
                    <button className="btn btn-primary px-3" onClick={askQuickAI} disabled={quickAiLoading || !quickAiInput.trim()}>
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Main */}
      <div className="dashboard-main min-h-screen w-full lg:ml-[280px] lg:w-[calc(100%-280px)]">
        {/* Navbar */}
        <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-slate-900/40 px-4 py-3 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.05)] sm:px-6">
          <div className="flex items-center justify-between gap-3">
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
        <main className="w-full px-4 pt-6 pb-4 sm:px-6 sm:pt-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
