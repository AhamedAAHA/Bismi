import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SceneRoot from "@/components/SceneRoot";

export const metadata: Metadata = {
  title: "3D Education Hub – Smart Tuition Management System",
  description:
    "A modern, professional tuition management system with admin, student and parent portals. Developed by AAHA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <SceneRoot />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
