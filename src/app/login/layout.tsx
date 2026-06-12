import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";
import OrbitalScene from "@/components/3d/OrbitalScene";
import { ArrowLeft } from "lucide-react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Orbital background — scrolls with page */}
      <OrbitalScene opacity={0.5} />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="btn btn-ghost btn-sm">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-5 py-8 lg:justify-start">
        {children}
      </main>
      <Footer />
    </div>
  );
}
