"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Loading, ErrorState } from "@/components/ui/States";
import { toast } from "@/components/ui/Toast";
import { Toaster } from "@/components/ui/Toast";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Send, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ExamPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await apiGet(`/api/student/tests/${id}`);
      if (!res.ok) { setErr(res.error!); setLoading(false); return; }
      setTest(res.data);
      setTimeLeft(res.data.durationMin * 60);
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!test || result) return;
    if (timeLeft <= 0) { submit(); return; }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [timeLeft, test, result]);

  async function submit() {
    if (submitting || result) return;
    setSubmitting(true);
    const res = await apiPost(`/api/student/tests/${id}/submit`, { answers });
    setSubmitting(false);
    if (!res.ok) { toast.error(res.error!); return; }
    setResult(res.data);
  }

  function goFrame() {
    sessionStorage.setItem("resultFrame", JSON.stringify({
      title: result.title,
      studentName: result.studentName,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
    }));
    router.push("/student/result-frame");
  }

  if (loading) return <Loading label="Loading test..." />;
  if (err) return <div><Toaster /><ErrorState message={err} /><div className="mt-4 text-center"><button className="btn btn-ghost" onClick={() => router.push("/student/tests")}>Back to Tests</button></div></div>;

  if (result) {
    return (
      <div className="mx-auto max-w-3xl">
        <Toaster />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
        <Card strong className="text-center">
          <div className={`mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full ${result.percentage >= 40 ? "bg-emerald-500/15 text-emerald-500" : "bg-rose-500/15 text-rose-500"}`}>
            <span className="text-2xl font-extrabold">{result.percentage}%</span>
          </div>
          <h2 className="text-2xl font-extrabold">Test Completed!</h2>
          <p className="text-muted">{result.title}</p>
          <p className="mt-2 text-3xl font-extrabold text-brand-500">{result.score} / {result.total}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button className="btn btn-primary" onClick={goFrame}><ImageIcon className="h-4 w-4" /> Generate Result Card</button>
            <button className="btn btn-ghost" onClick={() => router.push("/student/tests")}>Back to Tests</button>
          </div>
        </Card>
        </motion.div>

        <Card className="mt-4">
          <h3 className="mb-3 font-bold">Review Answers</h3>
          <div className="space-y-3">
            {result.review.map((q: any, i: number) => (
              <div key={q.id} className="rounded-xl border border-[var(--border)] p-3">
                <p className="font-semibold">{i + 1}. {q.text}</p>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {q.options.map((o: string, oi: number) => {
                    const isCorrect = oi === q.correct;
                    const isSelected = oi === q.selected;
                    return (
                      <div key={oi} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${isCorrect ? "bg-emerald-500/10 text-emerald-600" : isSelected ? "bg-rose-500/10 text-rose-600" : "bg-[var(--bg)]"}`}>
                        {isCorrect && <CheckCircle2 className="h-4 w-4" />}
                        {isSelected && !isCorrect && <XCircle className="h-4 w-4" />}
                        {o}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const q = test.questions[idx];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const answered = Object.keys(answers).length;

  return (
    <div className="exam-focus-shell mx-auto max-w-3xl">
      <Toaster />
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold">{test.title}</h1>
          <p className="text-sm text-muted">{answered}/{test.questions.length} answered</p>
        </div>
        <div className={`exam-timer-ring flex items-center justify-center font-bold text-sm ${timeLeft < 60 ? "text-rose-500" : ""}`}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3563ff" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle className="exam-timer-track" cx="28" cy="28" r="24" />
            <circle
              className="exam-timer-progress"
              cx="28"
              cy="28"
              r="24"
              strokeDasharray={150.8}
              strokeDashoffset={150.8 * (1 - timeLeft / (test.durationMin * 60))}
            />
          </svg>
          <span className="absolute">{mins}:{String(secs).padStart(2, "0")}</span>
        </div>
      </div>

      <Card strong>
        <p className="text-sm text-muted">Question {idx + 1} of {test.questions.length}</p>
        <h2 className="mt-1 text-lg font-bold">{q.text}</h2>
        <div className="mt-4 space-y-2">
          {q.options.map((o: string, oi: number) => (
            <button
              key={oi}
              onClick={() => setAnswers({ ...answers, [q.id]: oi })}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${answers[q.id] === oi ? "border-brand-500 bg-brand-500/10" : "border-[var(--border)] hover:border-brand-400"}`}
            >
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${answers[q.id] === oi ? "bg-brand-500 text-white" : "bg-[var(--bg)]"}`}>{String.fromCharCode(65 + oi)}</span>
              {o}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <button className="btn btn-ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}><ChevronLeft className="h-4 w-4" /> Prev</button>
          {idx < test.questions.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setIdx(idx + 1)}>Next <ChevronRight className="h-4 w-4" /></button>
          ) : (
            <button className="btn btn-primary" onClick={submit} disabled={submitting}><Send className="h-4 w-4" /> {submitting ? "Submitting..." : "Submit Test"}</button>
          )}
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2">
        {test.questions.map((_: any, i: number) => (
          <button key={i} onClick={() => setIdx(i)} className={`h-9 w-9 rounded-lg text-sm font-semibold ${i === idx ? "bg-brand-500 text-white" : answers[test.questions[i].id] !== undefined ? "bg-emerald-500/20 text-emerald-600" : "glass"}`}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
}
