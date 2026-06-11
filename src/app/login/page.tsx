import Link from "next/link";
import { ShieldCheck, GraduationCap, Users, ArrowRight } from "lucide-react";

const portals = [
  { href: "/login/admin", icon: ShieldCheck, title: "Admin", desc: "Manage students, tests, fees & more.", tone: "from-brand-500 to-brand-600" },
  { href: "/login/student", icon: GraduationCap, title: "Student", desc: "Take tests, view notes & homework.", tone: "from-accent-400 to-accent-600" },
  { href: "/login/parent", icon: Users, title: "Parent", desc: "Track attendance, marks & fees.", tone: "from-violet-400 to-violet-600" },
];

export default function LoginSelection() {
  return (
    <div className="w-full max-w-3xl text-center">
      <h1 className="text-3xl font-extrabold">Sign in to continue</h1>
      <p className="mt-2 text-sm text-muted">Select your portal to log in.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {portals.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="glass card group p-6 text-left transition hover:-translate-y-1"
          >
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${p.tone} text-white shadow-glow`}>
              <p.icon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted">{p.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-500">
              Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
