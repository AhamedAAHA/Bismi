import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";
import { prisma } from "@/lib/prisma";

async function askAimlChat(args: { question: string; context: string }) {
  const apiKey = process.env.AIML_API_KEY;
  if (!apiKey) return null;

  const model = process.env.AIML_MODEL_CHAT || "gpt-4o";
  const baseUrl = (process.env.AIML_BASE_URL || "https://api.aimlapi.com/v1").replace(/\/$/, "");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are BISMI AI Assistant for a tuition student dashboard. Give concise, correct answers. Use dashboard context if provided. If data is missing, say so clearly and suggest the exact student page to open.",
          },
          {
            role: "system",
            content: `Dashboard context:\n${args.context}`,
          },
          {
            role: "user",
            content: args.question,
          },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    const content = json?.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? content.trim() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

const knowledge: Record<string, string> = {
  photosynthesis:
    "Photosynthesis is the process by which green plants, algae and some bacteria convert light energy into chemical energy. Using sunlight, water (H₂O) absorbed by roots, and carbon dioxide (CO₂) from the air, chlorophyll in the leaves produces glucose (food) and releases oxygen.\n\nEquation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\n\nKey points:\n• Takes place in chloroplasts.\n• Chlorophyll (green pigment) absorbs light.\n• Produces oxygen which we breathe.",
  algebra:
    "Algebra is a branch of mathematics that uses letters (variables) to represent numbers in equations and formulas.\n\nKey ideas:\n• A variable (like x) represents an unknown value.\n• An equation says two expressions are equal, e.g. 2x + 3 = 11.\n• To solve, isolate the variable: 2x = 8, so x = 4.\n• Like terms can be combined: 3x + 2x = 5x.",
  gravity:
    "Gravity is the force that attracts any two objects with mass toward each other. On Earth, it pulls objects toward the ground with an acceleration of about 9.8 m/s². It keeps planets in orbit around the Sun and gives objects weight.",
  fractions:
    "A fraction represents a part of a whole, written as numerator/denominator (e.g. 3/4).\n\n• To add fractions, make denominators equal first.\n• To multiply, multiply tops and bottoms: 2/3 × 3/5 = 6/15 = 2/5.\n• To simplify, divide top and bottom by their common factor.",
  "water cycle":
    "The water cycle describes how water moves around Earth: \n• Evaporation: sun heats water into vapour.\n• Condensation: vapour forms clouds.\n• Precipitation: rain/snow falls.\n• Collection: water returns to rivers, lakes and oceans, and the cycle repeats.",
};

function generateMCQs(topic: string): string {
  return `Here are some practice MCQs on **${topic}**:\n\n1. Which statement best describes ${topic}?\n   a) A type of animal\n   b) A core concept in this subject ✅\n   c) A musical instrument\n   d) None of the above\n\n2. ${topic} is most closely related to which subject?\n   a) The subject you are currently studying ✅\n   b) Cooking\n   c) Sports\n   d) Painting\n\n3. Why is ${topic} important to learn?\n   a) It builds foundational understanding ✅\n   b) It is not important\n   c) Only for exams\n   d) None\n\nTip: Try writing your own answer first, then check the marked option.`;
}

export async function POST(req: NextRequest) {
  const student = await currentStudent();
  if (!student) return fail("Not authenticated", 401);

  const b = await req.json();
  const q = String(b.message || "").trim();
  if (!q) return fail("Please type a question.");

  const lower = q.toLowerCase();
  let answer = "";
  const today = new Date().toISOString().slice(0, 10);

  // Try AIML first using live student context; fallback to local logic below.
  const [ctxAttendance, ctxHomework, ctxSubmissions, ctxTests, ctxNotes, ctxResults] = await Promise.all([
    prisma.attendance.findMany({ where: { studentId: student.id }, orderBy: { date: "desc" }, take: 30 }),
    prisma.homework.findMany({
      where: student.classId ? { OR: [{ classId: student.classId }, { classId: null }] } : {},
      orderBy: { deadline: "asc" },
      take: 8,
    }),
    prisma.homeworkSubmission.findMany({ where: { studentId: student.id }, take: 50 }),
    prisma.test.findMany({
      where: student.classId
        ? { classId: student.classId, published: true, endTime: { gte: new Date() } }
        : { published: true, endTime: { gte: new Date() } },
      orderBy: { startTime: "asc" },
      take: 5,
    }),
    prisma.note.findMany({
      where: student.classId ? { OR: [{ classId: student.classId }, { classId: null }] } : {},
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.result.findMany({ where: { studentId: student.id }, orderBy: { date: "desc" }, take: 8 }),
  ]);

  const ctxPresent = ctxAttendance.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
  const ctxAttendancePct = ctxAttendance.length ? Math.round((ctxPresent / ctxAttendance.length) * 100) : 0;
  const ctxToday = ctxAttendance.find((a) => a.date === today);
  const submittedSet = new Set(ctxSubmissions.map((s) => s.homeworkId));
  const pendingHw = ctxHomework.filter((h) => !submittedSet.has(h.id));
  const avgScore = ctxResults.length
    ? Math.round(ctxResults.reduce((sum, r) => sum + (r.total > 0 ? (r.score / r.total) * 100 : 0), 0) / ctxResults.length)
    : 0;

  const context = [
    `Student: ${student.user.name} (${student.studentCode})`,
    `Class: ${student.class?.name || "-"}`,
    `Attendance(last ${ctxAttendance.length}): ${ctxAttendancePct}%`,
    `Today status: ${ctxToday?.status || "Not marked"} (${ctxToday?.checkIn || "-"} / ${ctxToday?.checkOut || "-"})`,
    `Pending homework: ${pendingHw.length}`,
    pendingHw.length
      ? `Pending list: ${pendingHw
          .slice(0, 4)
          .map((h) => `${h.title} (${new Date(h.deadline).toISOString().slice(0, 10)})`)
          .join(", ")}`
      : "Pending list: none",
    `Upcoming tests: ${ctxTests.length ? ctxTests.map((t) => `${t.title} (${new Date(t.startTime).toISOString().slice(0, 10)})`).join(", ") : "none"}`,
    `Latest notes: ${ctxNotes.length ? ctxNotes.map((n) => n.title).join(", ") : "none"}`,
    `Average score(last ${ctxResults.length}): ${avgScore}%`,
  ].join("\n");

  const aimlAnswer = await askAimlChat({ question: q, context });
  if (aimlAnswer) return ok({ answer: aimlAnswer });

  if (lower.includes("attendance")) {
    const [latest, records] = await Promise.all([
      prisma.attendance.findFirst({
        where: { studentId: student.id },
        orderBy: { date: "desc" },
      }),
      prisma.attendance.findMany({
        where: { studentId: student.id },
        orderBy: { date: "desc" },
        take: 30,
      }),
    ]);
    const present = records.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
    const pct = records.length ? Math.round((present / records.length) * 100) : 0;
    const todayRec = records.find((a) => a.date === today);
    answer = [
      `Attendance summary for ${student.user.name}:`,
      `• Last ${records.length} days attendance: ${pct}%`,
      `• Today's status: ${todayRec?.status || "Not marked"}`,
      `• Last recorded day: ${latest?.date || "-"} (${latest?.status || "-"})`,
      `• Check-in/out: ${todayRec?.checkIn || "-"} / ${todayRec?.checkOut || "-"}`,
    ].join("\n");
  } else if (lower.includes("homework")) {
    const [homework, submissions] = await Promise.all([
      prisma.homework.findMany({
        where: student.classId ? { OR: [{ classId: student.classId }, { classId: null }] } : {},
        orderBy: { deadline: "asc" },
      }),
      prisma.homeworkSubmission.findMany({ where: { studentId: student.id } }),
    ]);
    const done = new Set(submissions.map((s) => s.homeworkId));
    const pending = homework.filter((h) => !done.has(h.id));
    const next = pending.slice(0, 3);
    answer = [
      `Homework summary for ${student.user.name}:`,
      `• Pending: ${pending.length}`,
      next.length
        ? `• Next deadlines: ${next.map((h) => `${h.title} (${new Date(h.deadline).toISOString().slice(0, 10)})`).join(", ")}`
        : "• No pending homework right now.",
    ].join("\n");
  } else if (lower.includes("test") || lower.includes("exam") || lower.includes("quiz")) {
    const now = new Date();
    const tests = await prisma.test.findMany({
      where: student.classId ? { classId: student.classId, published: true, endTime: { gte: now } } : { published: true, endTime: { gte: now } },
      orderBy: { startTime: "asc" },
      take: 5,
    });
    answer = tests.length
      ? [
          "Upcoming tests:",
          ...tests.map((t, i) => `${i + 1}. ${t.title} (${new Date(t.startTime).toISOString().slice(0, 10)})`),
          "Open Student > Tests to start or verify access code.",
        ].join("\n")
      : "No upcoming published tests right now.";
  } else if (lower.includes("note")) {
    const notes = await prisma.note.findMany({
      where: student.classId ? { OR: [{ classId: student.classId }, { classId: null }] } : {},
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    answer = notes.length
      ? ["Latest notes:", ...notes.map((n, i) => `${i + 1}. ${n.title}`)].join("\n")
      : "No notes available yet.";
  } else if (lower.includes("result") || lower.includes("mark") || lower.includes("score")) {
    const results = await prisma.result.findMany({
      where: { studentId: student.id },
      orderBy: { date: "desc" },
      take: 8,
    });
    const avg = results.length
      ? Math.round(results.reduce((sum, r) => sum + (r.total > 0 ? (r.score / r.total) * 100 : 0), 0) / results.length)
      : 0;
    answer = results.length
      ? [
          `Your average score (last ${results.length} results): ${avg}%`,
          `Latest: ${results[0].title} - ${results[0].score}/${results[0].total}`,
        ].join("\n")
      : "No results available yet.";
  } else if (lower.includes("schedule") || lower.includes("class time")) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = days[new Date().getDay()];
    const items = await prisma.schedule.findMany({
      where: student.classId ? { classId: student.classId, day: todayName } : { day: todayName },
      orderBy: { startTime: "asc" },
      take: 6,
      include: { subject: true },
    });
    answer = items.length
      ? [
          `Today's classes (${todayName}):`,
          ...items.map((s, i) => `${i + 1}. ${s.subject?.name || "Subject"} ${s.startTime}-${s.endTime}`),
        ].join("\n")
      : `No classes scheduled for ${todayName}.`;
  } else if (lower.includes("mcq") || lower.includes("quiz") || lower.includes("questions for")) {
    const topic = q.replace(/give me mcqs?( for)?|mcqs?( for)?|quiz( on)?|questions for/gi, "").trim() || "this topic";
    answer = generateMCQs(topic);
  } else if (lower.startsWith("summarize") || lower.includes("summary")) {
    const topic = q.replace(/summarize|summary( of)?|this lesson|please/gi, "").trim();
    const known = Object.keys(knowledge).find((k) => lower.includes(k));
    if (known) {
      answer = `**Summary of ${known}:**\n\n${knowledge[known].split("\n")[0]}\n\nIn short: focus on the core definition, the key process/steps, and why it matters. Re-read the main equation or example and try to explain it in your own words.`;
    } else {
      answer = `Here is how to summarize "${topic || "your lesson"}":\n\n• Identify the main idea in one sentence.\n• List 3-4 key points or steps.\n• Note any important formula, date or definition.\n• Write a one-line conclusion in your own words.\n\nPaste the lesson text and I'll help you condense it!`;
    }
  } else {
    const known = Object.keys(knowledge).find((k) => lower.includes(k));
    if (known) {
      answer = knowledge[known];
    } else {
      answer =
        'I can help with both study topics and your live dashboard data.\n\nTry asking:\n• "How is my attendance?"\n• "Any pending homework?"\n• "Do I have upcoming tests?"\n• "Show my latest notes"\n• "What is my average score?"\n• "Give me MCQs for algebra"';
    }
  }

  return ok({ answer });
}
