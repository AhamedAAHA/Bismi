"use client";

import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

let listeners: ((t: ToastItem) => void)[] = [];
let counter = 0;

export const toast = {
  success: (m: string) => emit("success", m),
  error: (m: string) => emit("error", m),
  info: (m: string) => emit("info", m),
};

function emit(type: ToastType, message: string) {
  const item = { id: ++counter, type, message };
  listeners.forEach((l) => l(item));
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setItems((prev) => [...prev, t]);
      setTimeout(() => {
        setItems((prev) => prev.filter((p) => p.id !== t.id));
      }, 3800);
    };
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className="glass-strong card fade-up flex items-start gap-3 p-3.5 shadow-lg"
        >
          {t.type === "success" && (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          )}
          {t.type === "error" && (
            <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
          )}
          {t.type === "info" && (
            <Info className="h-5 w-5 shrink-0 text-brand-500" />
          )}
          <p className="flex-1 text-sm">{t.message}</p>
          <button
            onClick={() => setItems((prev) => prev.filter((p) => p.id !== t.id))}
            className="text-muted hover:text-rose-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
