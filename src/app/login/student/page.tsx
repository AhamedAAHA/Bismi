"use client";

import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import { GraduationCap } from "lucide-react";

export default function StudentLogin() {
  return (
    <Suspense>
      <LoginForm
        role="STUDENT"
        title="Student Login"
        subtitle="Enter your Student ID and password to continue."
        icon={GraduationCap}
        identifierLabel="Student ID / Code"
        identifierPlaceholder="STU001"
        tone="from-accent-400 to-accent-600"
        dest="/student"
      />
    </Suspense>
  );
}
