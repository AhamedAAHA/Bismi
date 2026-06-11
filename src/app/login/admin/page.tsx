"use client";

import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  return (
    <Suspense>
      <LoginForm
        role="ADMIN"
        title="Admin Login"
        subtitle="Sign in to manage your tuition center."
        icon={ShieldCheck}
        identifierLabel="Email Address"
        identifierPlaceholder="admin@3dedu.hub"
        demo={{ id: "admin@3dedu.hub", pass: "admin123" }}
        tone="from-brand-500 to-brand-600"
        dest="/admin"
      />
    </Suspense>
  );
}
