"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useFetch } from "@/lib/useFetch";
import { apiPost, apiPut, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Loading, EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";
import Field from "@/components/ui/Field";
import { toast } from "@/components/ui/Toast";
import { ArrowLeft, Plus, Trash2, Pencil, CheckCircle2, ListChecks } from "lucide-react";

export default function TestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: test, loading, refetch } = useFetch<any>(`/api/admin/tests/${id}`);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({ options: ["", "", "", ""], correct: 0, marks: 1 });

  function openCreate() {
    setEditing(null);
    setForm({ text: "", options: ["", "", "", ""], correct: 0, marks: 1 });
    setOpen(true);
  }
  function openEdit(q: any) {
    setEditing(q);
    setForm({ text: q.text, options: JSON.parse(q.options), correct: q.correct, marks: q.marks });
    setOpen(true);
  }
  function setOption(i: number, v: string) {
    const opts = [...form.options];
    opts[i] = v;
    setForm({ ...form, options: opts });
  }

  async function save() {
    const opts = form.options.filter((o: string) => o.trim());
    if (!form.text?.trim()) return toast.error("Question text required.");
    if (opts.length < 2) return toast.error("At least 2 options required.");
    setSaving(true);
    const res = editing
      ? await apiPut(`/api/admin/questions/${editing.id}`, form)
      : await apiPost(`/api/admin/tests/${id}/questions`, form);
    setSaving(false);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Saved"); setOpen(false); refetch();
  }
  async function remove(q: any) {
    if (!confirm("Delete this question?")) return;
    const res = await apiDelete(`/api/admin/questions/${q.id}`);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Deleted"); refetch();
  }

  if (loading) return <Loading />;
  if (!test) return <EmptyState title="Test not found" />;

  return (
    <div>
      <Link href="/admin/tests" className="btn btn-ghost btn-sm mb-3"><ArrowLeft className="h-4 w-4" /> Back to Tests</Link>
      <PageHeader title={test.title} subtitle={`Access code: ${test.accessCode} • ${test.totalMarks} marks • ${test.durationMin} min`}
        action={<button className="btn btn-primary" onClick={openCreate}><Plus className="h-4 w-4" /> Add Question</button>} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <SectionTitle title="Questions" subtitle={`${test.questions.length} question(s)`} />
            {test.questions.length === 0 ? (
              <EmptyState icon={ListChecks} title="No questions yet" message="Add MCQ questions to this test." />
            ) : (
              <div className="space-y-3">
                {test.questions.map((q: any, i: number) => {
                  const opts = JSON.parse(q.options);
                  return (
                    <div key={q.id} className="rounded-xl border border-[var(--border)] p-4">
                      <div className="flex justify-between gap-3">
                        <p className="font-semibold">{i + 1}. {q.text} <span className="badge badge-blue ml-1">{q.marks} mark</span></p>
                        <div className="flex shrink-0 gap-1.5">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(q)}><Pencil className="h-3.5 w-3.5" /></button>
                          <button className="btn btn-ghost btn-sm text-rose-500" onClick={() => remove(q)}><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {opts.map((o: string, oi: number) => (
                          <div key={oi} className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm ${oi === q.correct ? "bg-emerald-500/10 text-emerald-600" : "bg-[var(--bg)]"}`}>
                            {oi === q.correct && <CheckCircle2 className="h-4 w-4" />}
                            {o}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <Card>
          <SectionTitle title="Attempts" subtitle="Auto-graded results" />
          {test.attempts.length === 0 ? (
            <EmptyState title="No attempts yet" />
          ) : (
            <div className="space-y-2">
              {test.attempts.filter((a: any) => a.submitted).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3">
                  <div>
                    <p className="font-semibold">{a.student.user.name}</p>
                    <p className="text-xs text-muted">{a.student.studentCode}</p>
                  </div>
                  <span className="badge badge-green">{a.score}/{a.total}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Question" : "Add Question"}
        footer={<><button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={save} disabled={saving}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Question Text *"><textarea className="textarea" rows={2} value={form.text || ""} onChange={(e) => setForm({ ...form, text: e.target.value })} /></Field>
          <div>
            <label className="label">Options (select the correct one)</label>
            <div className="space-y-2">
              {form.options.map((o: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={form.correct === i} onChange={() => setForm({ ...form, correct: i })} />
                  <input className="input" value={o} placeholder={`Option ${i + 1}`} onChange={(e) => setOption(i, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
          <Field label="Marks"><input type="number" className="input" value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
