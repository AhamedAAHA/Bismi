"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import OrbitalScene from "@/components/3d/OrbitalScene";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Mail,
  QrCode,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const GlobalScene = dynamic(() => import("@/components/3d/GlobalScene"), { ssr: false });

const nav = [
  { href: "#platform", label: "Platform" },
  { href: "#services", label: "Services" },
  { href: "#portals",  label: "Portals"  },
];

const features = [
  { icon: ClipboardCheck, title: "Scheduled", desc: "Attendance, class plans and daily operations." },
  { icon: BadgeCheck,     title: "Verified",  desc: "Tests, marks, homework and student progress." },
  { icon: FileText,       title: "Reported",  desc: "Receipts, emails, exports and parent updates." },
];

const services = [
  { icon: QrCode,      title: "Daily QR Code",       desc: "Fast student check-in and check-out with secure daily codes." },
  { icon: Brain,       title: "AI Study Assistant",   desc: "Students can ask for explanations, MCQs and summaries." },
  { icon: Trophy,      title: "Leaderboard",          desc: "Rank by marks, attendance and homework completion." },
  { icon: CalendarDays,title: "Class Schedule",       desc: "Today and upcoming classes with teacher assignments." },
  { icon: Mail,        title: "Parent Emails",        desc: "Automatic updates for absences, marks and announcements." },
];

const portals = [
  { href: "/login/admin",   icon: ShieldCheck,   title: "Admin OS",   desc: "Manage students, classes, fees, tests and reports." },
  { href: "/login/student", icon: GraduationCap, title: "Student OS", desc: "Attend, learn, submit work and track progress." },
  { href: "/login/parent",  icon: Users,         title: "Parent OS",  desc: "Follow children, marks, fees and notifications." },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-[var(--muted)] md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}
              className="transition-colors hover:text-[#54f4ff]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn btn-primary btn-sm">
            Launch OS
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO — 3D GlobalScene as inline background
      ══════════════════════════════════════════ */}
      <section
        id="platform"
        className="relative overflow-hidden"
        style={{ minHeight: "80vh" }}
      >
        {/* 3D canvas fills the section — scrolls with it */}
        <GlobalScene />

        {/* Very subtle bottom fade so hero blends into next section */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: "linear-gradient(to bottom, transparent, #050814)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Hero text — above scene */}
        <div
          className="relative mx-auto flex max-w-2xl flex-col items-center px-5 pb-24 pt-16 text-center"
          style={{ zIndex: 10 }}
        >
          <span className="badge badge-blue mb-6 inline-flex gap-1.5 border border-[#54f4ff]/20 bg-[#54f4ff]/10 px-3 py-1.5 text-xs font-bold tracking-wide text-[#54f4ff]">
            <Sparkles className="h-3.5 w-3.5" />
            Tuition management command center
          </span>

          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
            Run attendance, tests, fees and parent updates from one workspace.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-[#9aa9c4]">
            Bismi gives tuition centers a polished operating system for daily
            classes, student progress, homework, receipts and parent communication.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/login" className="btn btn-primary">
              Launch workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#services" className="btn btn-ghost">
              View services
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES STRIP — 3 pillars
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#050814] py-12">
        {/* OrbitalScene anchored right — low opacity so cards are legible */}
        <OrbitalScene opacity={0.28} />

        <div className="relative z-10 mx-auto max-w-6xl px-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass card p-5">
                <f.icon className="h-5 w-5 text-[#54f4ff]" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-[#54f4ff]/70">
                  {f.title}
                </p>
                <p className="mt-1.5 text-base font-extrabold leading-snug text-white">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════ */}
      <section id="services" className="relative overflow-hidden bg-[#040912] py-16">
        <OrbitalScene opacity={0.38} />

        <div className="relative z-10 mx-auto max-w-6xl px-5">
          {/* Section header */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#54f4ff]">
                Services
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Everything runs from one console
              </h2>
            </div>
            <Link href="/login" className="btn btn-ghost shrink-0 text-sm">
              Open portals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Service cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <div key={s.title} className="glass card p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#54f4ff]/20 bg-[#54f4ff]/10 text-[#54f4ff]">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-extrabold text-white">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#9aa9c4]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PORTALS
      ══════════════════════════════════════════ */}
      <section id="portals" className="relative overflow-hidden bg-[#050814] py-16">
        <OrbitalScene opacity={0.45} />

        <div className="relative z-10 mx-auto max-w-6xl px-5">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#54f4ff]">
              Portals
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Pick your role
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {portals.map((p) => (
              <Link key={p.href} href={p.href}
                className="glass-strong card group flex flex-col p-6 transition-all hover:border-[#54f4ff]/30">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#54f4ff] to-[#2f8fff] text-[#03111f] shadow-[0_0_20px_rgba(84,244,255,0.35)]">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--muted)] transition-all group-hover:translate-x-1 group-hover:text-[#54f4ff]" />
                </div>
                <h3 className="text-xl font-black text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#9aa9c4]">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
