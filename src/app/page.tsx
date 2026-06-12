"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import OrbitalScene from "@/components/3d/OrbitalScene";
const CommandCenterScene = dynamic(() => import("@/components/3d/CommandCenterScene"), { ssr: false });
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


const nav = [
  { href: "#platform", label: "Platform" },
  { href: "#services", label: "Services" },
  { href: "#portals", label: "Portals" },
];

const features = [
  { icon: ClipboardCheck, title: "Scheduled", desc: "Attendance, class plans and daily operations." },
  { icon: BadgeCheck, title: "Verified", desc: "Tests, marks, homework and student progress." },
  { icon: FileText, title: "Reported", desc: "Receipts, emails, exports and parent updates." },
];

const services = [
  { icon: QrCode, title: "Daily QR Code", desc: "Fast student check-in and check-out with secure daily codes." },
  { icon: Brain, title: "AI Study Assistant", desc: "Students can ask for explanations, MCQs and summaries." },
  { icon: Trophy, title: "Leaderboard", desc: "Rank by marks, attendance and homework completion." },
  { icon: CalendarDays, title: "Class Schedule", desc: "Today and upcoming classes with teacher assignments." },
  { icon: Mail, title: "Parent Emails", desc: "Automatic updates for absences, marks and announcements." },
];

const portals = [
  { href: "/login/admin", icon: ShieldCheck, title: "Admin OS", desc: "Manage students, classes, fees, tests and reports." },
  { href: "/login/student", icon: GraduationCap, title: "Student OS", desc: "Attend, learn, submit work and track progress." },
  { href: "/login/parent", icon: Users, title: "Parent OS", desc: "Follow children, marks, fees and notifications." },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <OrbitalScene opacity={0.55} />
      {/* ── Navbar ── */}
      <header className="nav-glass relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="logo-prominent">
            <Logo />
          </div>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-muted md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn btn-primary btn-sm">
            Launch OS
          </Link>
        </div>
      </header>

      {/* ── Hero (split) ── */}
      <section id="platform" className="relative overflow-hidden py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 col-span-1 z-10">
              <span className="badge badge-blue mb-5 inline-flex border border-accent-400/20 bg-accent-400/10">
                <Sparkles className="h-3.5 w-3.5" /> Tuition management command center
              </span>
              <h1 className="hero-headline text-white mt-4 text-3xl sm:text-4xl lg:text-5xl tracking-[-0.03em]">
                Run attendance, tests, fees and parent communication from one intelligent platform
              </h1>
              <p className="hero-sub mt-6 text-lg text-muted max-w-2xl">
                Manage students, classes, attendance, exams, homework, fees, reports and parent communication through a unified education operating system.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="btn btn-primary">
                  Launch Workspace <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#services" className="btn btn-ghost">
                  View Services
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 col-span-1 relative w-full lg:h-[640px] md:h-[560px] h-[420px]">
              <div className="absolute inset-0 rounded-[32px] overflow-hidden border border-white/10 bg-slate-950/10 shadow-2xl shadow-slate-950/20">
                <CommandCenterScene animated={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card glass">
                <div className="icon-wrap bg-accent-400/8 text-accent-400">
                  <feature.icon className="icon" />
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.24em] text-muted">{feature.title}</p>
                <h2 className="mt-1 text-lg font-extrabold text-white">{feature.desc}</h2>
                <div className="glow-border" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services section ── */}
      <section id="services" className="relative overflow-hidden py-14">
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent-400">
                Services
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                Everything runs from one console
              </h2>
            </div>
            <Link href="/login" className="btn btn-ghost w-fit">
              Open portals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="equal-grid">
            {services.map((service) => (
              <div key={service.title} className="feature-card glass">
                <div className="icon-wrap bg-accent-400/8 text-accent-400">
                  <service.icon className="icon" />
                </div>
                <h3 className="mt-1 font-extrabold text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{service.desc}</p>
                <div className="glow-border" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portals section ── */}
      <section id="portals" className="relative overflow-hidden pb-16 pt-4">
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <div className="grid gap-4 md:grid-cols-3">
            {portals.map((portal) => (
              <Link key={portal.href} href={portal.href} className="feature-card glass">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-brand-500 text-[#03111f] shadow-glow">
                    <portal.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted" />
                </div>
                <h3 className="text-xl font-black text-white">{portal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{portal.desc}</p>
                <div className="glow-border" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
