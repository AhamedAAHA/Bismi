import Link from "next/link";
import dynamic from "next/dynamic";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Users,
  QrCode,
  ClipboardCheck,
  Brain,
  Trophy,
  CalendarDays,
  Mail,
  FileText,
} from "lucide-react";

const features = [
  { icon: ClipboardCheck, title: "Smart Attendance", desc: "Manual, bulk & QR check-in with late tracking and exports." },
  { icon: QrCode, title: "Daily QR Code", desc: "Generate a daily QR for fast, secure student check-in/out." },
  { icon: FileText, title: "Online Tests", desc: "MCQ exams with access codes, auto-grading & instant results." },
  { icon: Brain, title: "AI Study Assistant", desc: "Students get explanations, MCQs and lesson summaries." },
  { icon: Trophy, title: "Leaderboard", desc: "Rank by marks, attendance & homework completion." },
  { icon: CalendarDays, title: "Class Schedule", desc: "Today's and upcoming classes with teacher assignments." },
  { icon: Mail, title: "Email Notifications", desc: "Automatic parent emails for absence, marks and updates." },
];

const portals = [
  { href: "/login/admin", icon: ShieldCheck, title: "Admin Portal", desc: "Manage everything in one place.", tone: "from-brand-500 to-brand-600" },
  { href: "/login/student", icon: GraduationCap, title: "Student Portal", desc: "Tests, notes, homework & AI help.", tone: "from-accent-400 to-accent-600" },
  { href: "/login/parent", icon: Users, title: "Parent Portal", desc: "Track your child's progress.", tone: "from-violet-400 to-violet-600" },
];

const Hero3D = dynamic(() => import("@/components/3d/Hero3D"), { ssr: false });

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login" className="btn btn-primary btn-sm">
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        {/* Hero */}
        <section className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <div className="fade-up">
            <span className="badge badge-blue mb-4">
              <GraduationCap className="h-3.5 w-3.5" /> Smart Tuition Management
            </span>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Run your tuition center the{" "}
              <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">
                smart way
              </span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted">
              3D Education Hub brings attendance, online tests, homework,
              leaderboards and parent communication together in one beautiful,
              professional platform.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/login" className="btn btn-primary">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#features" className="btn btn-ghost">
                Explore features
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-sm text-muted">
              <span>✔ Role-based secure access</span>
              <span>✔ Email notifications</span>
              <span>✔ Fully responsive</span>
            </div>
          </div>

          <div className="fade-up relative">
            <Hero3D />
            <div className="glass-strong card hero-overlay-card mt-4 p-5 md:absolute md:bottom-4 md:left-4 md:right-4 md:mt-0">
              <div className="grid grid-cols-3 gap-3">
                {portals.map((p) => (
                  <div key={p.href} className="glass card flex flex-col items-center gap-2 p-4 text-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.tone} text-white shadow-glow`}>
                      <p.icon className="h-6 w-6" />
                    </div>
                    <p className="text-xs font-semibold">{p.title.replace(" Portal", "")}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {features.slice(0, 3).map((f) => (
                  <div key={f.title} className="glass card flex items-center gap-3 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                      <f.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{f.title}</p>
                      <p className="text-xs text-muted">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Portals */}
        <section className="py-10">
          <h2 className="text-center text-2xl font-bold">Choose your portal</h2>
          <p className="mt-1 text-center text-sm text-muted">
            Secure, role-based access for everyone.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {portals.map((p) => (
              <Link key={p.href} href={p.href} className="glass card group p-6 transition hover:-translate-y-1">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.tone} text-white shadow-glow`}>
                  <p.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-500">
                  Login <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-12">
          <h2 className="text-center text-2xl font-bold">Everything you need</h2>
          <p className="mt-1 text-center text-sm text-muted">
            A complete toolkit for modern tuition centers.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="glass card p-5">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
