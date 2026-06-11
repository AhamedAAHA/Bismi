import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/http";
import { currentStudent } from "@/lib/portal";

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

  if (lower.includes("mcq") || lower.includes("quiz") || lower.includes("questions for")) {
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
      answer = `Great question! Here's how to approach "${q}":\n\n• Break the topic into smaller parts.\n• Look for the key definition first.\n• Find a real-world example to connect the idea.\n• Practice with a few questions.\n\nI can explain common topics like photosynthesis, algebra, gravity, fractions and the water cycle in detail. Try: "Explain photosynthesis" or "Give me MCQs for algebra".`;
    }
  }

  return ok({ answer });
}
