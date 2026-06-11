import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import EduBackground from "@/components/EduBackground";

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
          <EduBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
