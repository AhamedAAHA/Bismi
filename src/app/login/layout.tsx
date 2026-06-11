import Link from "next/link";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="btn btn-ghost btn-sm">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
