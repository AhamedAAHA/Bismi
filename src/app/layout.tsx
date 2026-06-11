import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Bismi – Smart Tuition Management System",
  description:
    "A modern, professional tuition management system with admin, student and parent portals. Developed by AAHA.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#040914",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-[#040914]">
      <body className="font-sans">
        <ThemeProvider>
          <div className="app-content">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
