"use client";

import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";
import { Users } from "lucide-react";

export default function ParentLogin() {
  return (
    <Suspense>
      <LoginForm
        role="PARENT"
        title="Parent Login"
        subtitle="Use the shared Parent Access ID and password."
        icon={Users}
        identifierLabel="Parent Access ID"
        identifierPlaceholder="Enter parent access ID"
        tone="from-violet-400 to-violet-600"
        dest="/parent"
      />
    </Suspense>
  );
}
