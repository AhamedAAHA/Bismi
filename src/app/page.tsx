import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
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

const metrics = [
  { label: "Attendance", value: "94%", tone: "text-emerald-300" },
  { label: "Avg. Score", value: "86%", tone: "text-accent-400" },
  { label: "Pending HW", value: "12", tone: "text-amber-300" },
];

const operations = [
  { icon: CheckCircle2, title: "QR attendance synced", meta: "Grade 10A - 08:55 AM" },
  { icon: BarChart3, title: "Science quiz results ready", meta: "32 submissions graded" },
  { icon: Bell, title: "Parent alerts prepared", meta: "5 absence notices queued" },
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
    <div className="relative min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
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

      <main className="mx-auto max-w-7xl px-5">
        <section
          id="platform"
          className="grid items-center gap-10 pb-10 pt-10 lg:min-h-[calc(100vh-92px)] lg:grid-cols-[0.92fr_1.08fr]"
        >
          <div className="fade-up max-w-2xl">
            <span className="badge badge-blue mb-5 border border-accent-400/20 bg-accent-400/10">
              <Sparkles className="h-3.5 w-3.5" /> Tuition management command center
            </span>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Run attendance, tests, fees and parent updates from one workspace.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              Bismi gives tuition centers a polished operating system for
              daily classes, student progress, homework, receipts and parent
              communication.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="btn btn-primary">
                Launch workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#services" className="btn btn-ghost">
                View services
              </Link>
            </div>
          </div>

          <div className="glass-strong card relative overflow-hidden p-4 sm:p-6">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-400/70 to-transparent" />
            <div className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent-400">
                  Live Operations
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                  Today&apos;s center overview
                </h2>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                Live
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-[var(--border)] bg-white/[0.035] p-4">
                  <p className="text-xs text-muted">{metric.label}</p>
                  <p className={`mt-2 text-3xl font-black ${metric.tone}`}>{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.86fr]">
              <div className="rounded-2xl border border-[var(--border)] bg-[#071123]/70 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="font-extrabold text-white">Class workload</h3>
                  <span className="text-xs text-muted">Updated now</span>
                </div>
                {[
                  ["Grade 10A", "88%"],
                  ["Grade 9A", "72%"],
                  ["Grade 8B", "64%"],
                ].map(([label, value]) => (
                  <div key={label} className="mb-4 last:mb-0">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{label}</span>
                      <span className="text-muted">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-500"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {operations.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-white/[0.035] p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-400/10 text-accent-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{item.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-white/[0.035] p-4 text-sm text-muted">
              <Clock className="h-5 w-5 text-accent-400" />
              <span>Next class starts at</span>
              <b className="text-white">04:30 PM</b>
              <span className="hidden sm:inline">-</span>
              <span>Mathematics with Mr. Ravi</span>
            </div>
          </div>
        </section>

        <section className="grid gap-3 pb-10 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass card p-4">
              <feature.icon className="h-5 w-5 text-accent-400" />
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.24em] text-muted">
                {feature.title}
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-white">{feature.desc}</h2>
            </div>
          ))}
        </section>

        <section id="services" className="py-14">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-accent-400">
                Services
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Everything runs from one console</h2>
            </div>
            <Link href="/login" className="btn btn-ghost w-fit">
              Open portals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
        </section>

        <section id="portals" className="pb-16 pt-4">
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
        </section>
      </main>
    </div>
  );
}
