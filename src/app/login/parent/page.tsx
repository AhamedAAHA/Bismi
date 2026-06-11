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
        subtitle="Enter your Parent ID and password to continue."
        icon={Users}
        identifierLabel="Parent ID / Code"
        identifierPlaceholder="PAR001"
        demo={{ id: "PAR001", pass: "1234" }}
        tone="from-violet-400 to-violet-600"
        dest="/parent"
      />
    </Suspense>
  );
}
