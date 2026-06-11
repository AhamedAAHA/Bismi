"use client";

import { useRef, useState, useEffect } from "react";
import { apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Card";
import { Brain, Send, Sparkles, User } from "lucide-react";
import ModuleAccent from "@/components/3d/ModuleAccent";
import { motion, AnimatePresence } from "framer-motion";

interface Msg { role: "user" | "ai"; text: string }

const suggestions = [
  "Explain photosynthesis.",
  "Give me MCQs for algebra.",
  "Summarize this lesson on gravity.",
  "Explain fractions.",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your AI Study Assistant. Ask me to explain a topic, generate MCQs, or summarize a lesson." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function ask(text?: string) {
    const q = (text || input).trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    const res = await apiPost("/api/student/assistant", { message: q });
    setLoading(false);
    setMessages((m) => [...m, { role: "ai", text: res.ok ? res.data.answer : res.error || "Sorry, something went wrong." }]);
  }

  return (
    <div>
      <PageHeader title="AI Study Assistant" subtitle="Your personal tutor — explanations, MCQs and summaries." />
      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <ModuleAccent variant="ai" height={180} className="lg:col-span-1" />
        <div className="glass card flex items-center justify-center gap-1 p-4 lg:col-span-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="ai-wave-bar" style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
      <Card className="flex h-[calc(100vh-260px)] min-h-[420px] flex-col p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${m.role === "user" ? "bg-brand-500 text-white" : "bg-gradient-to-br from-accent-400 to-accent-600 text-white"}`}>
                {m.role === "user" ? <User className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
              </div>
              <div className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-brand-500 text-white" : "glass"}`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 text-white"><Brain className="h-5 w-5" /></div>
              <div className="glass rounded-2xl px-4 py-2.5 text-sm text-muted">Thinking...</div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-[var(--border)] p-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => ask(s)} className="flex items-center gap-1 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-muted transition hover:border-brand-500 hover:text-brand-500">
                <Sparkles className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
            />
            <button className="btn btn-primary" onClick={() => ask()} disabled={loading}><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}
