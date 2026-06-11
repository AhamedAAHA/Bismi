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
      {/* ── Navbar ── */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
        <Logo />
        <nav className="hidden items-center gap-8 text-xs font-semibold text-muted md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-accent-400">
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

      {/* ── Hero section with inline GlobalScene ── */}
      <section
        id="platform"
        className="relative overflow-hidden"
      >
        {/* 3D scene as absolute background — scrolls with section */}
        <GlobalScene />

        {/* Hero content — above scene */}
        <div className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-14 text-center sm:pb-24 sm:pt-16">
          <div className="fade-up">
            <span className="badge badge-blue mb-5 inline-flex border border-accent-400/20 bg-accent-400/10">
              <Sparkles className="h-3.5 w-3.5" /> Tuition management command center
            </span>
            <h1 className="text-balance text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Run attendance, tests, fees and parent updates from one workspace.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted">
              Bismi gives tuition centers a polished operating system for
              daily classes, student progress, homework, receipts and parent
              communication.
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
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="relative overflow-hidden">
        <OrbitalScene opacity={0.3} />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-10">
          <div className="grid gap-3 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="glass card p-4">
                <feature.icon className="h-5 w-5 text-accent-400" />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-muted">
                  {feature.title}
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-white">{feature.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services section ── */}
      <section id="services" className="relative overflow-hidden py-14">
        <OrbitalScene opacity={0.45} />
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => (
              <div key={service.title} className="glass card min-h-[180px] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-400/20 bg-accent-400/10 text-accent-400">
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-extrabold text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portals section ── */}
      <section id="portals" className="relative overflow-hidden pb-16 pt-4">
        <OrbitalScene opacity={0.5} />
        <div className="relative z-10 mx-auto max-w-7xl px-5">
          <div className="grid gap-4 md:grid-cols-3">
            {portals.map((portal) => (
              <Link key={portal.href} href={portal.href} className="glass-strong card group p-5">
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-brand-500 text-[#03111f] shadow-glow">
                    <portal.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-1 group-hover:text-accent-400" />
                </div>
                <h3 className="text-xl font-black text-white">{portal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{portal.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
