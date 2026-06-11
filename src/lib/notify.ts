import { prisma } from "./prisma";
import { sendEmail } from "./email";
import { formatDate } from "./utils";

// Resolve a parent's email for a given student
async function parentForStudent(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true, parent: { include: { user: true } } },
  });
  if (!student) return null;
  const parent = student.parent;
  const email = parent?.user.email || null;
  return { student, parent, email };
}

export async function notifyAbsence(studentId: string, date: string) {
  const info = await parentForStudent(studentId);
  if (!info?.email) return;
  await sendEmail({
    to: info.email,
    toName: info.parent?.user.name,
    subject: "Absence Alert",
    category: "ABSENCE",
    parentId: info.parent?.id,
    studentId,
    html: `<p>Dear ${info.parent?.user.name || "Parent"},</p>
      <p>This is to inform you that <b>${info.student.user.name}</b> was marked <b>ABSENT</b> on <b>${formatDate(date)}</b>.</p>
      <p>Please contact us if this is unexpected.</p>`,
  });
}

export async function notifyLowMarks(studentId: string, title: string, score: number, total: number) {
  const info = await parentForStudent(studentId);
  if (!info?.email) return;
  await sendEmail({
    to: info.email,
    toName: info.parent?.user.name,
    subject: "Low Marks Alert",
    category: "LOW_MARKS",
    parentId: info.parent?.id,
    studentId,
    html: `<p>Dear ${info.parent?.user.name || "Parent"},</p>
      <p><b>${info.student.user.name}</b> scored <b>${score}/${total}</b> in <b>${title}</b>, which is below the expected level.</p>
      <p>We recommend some extra practice. Please reach out for guidance.</p>`,
  });
}

export async function notifyNewHomework(classId: string | null, title: string, deadline: Date) {
  const students = await prisma.student.findMany({
    where: classId ? { classId } : {},
    include: { parent: { include: { user: true } }, user: true },
  });
  for (const s of students) {
    const email = s.parent?.user.email;
    if (!email) continue;
    await sendEmail({
      to: email,
      toName: s.parent?.user.name,
      subject: "New Homework Assigned",
      category: "HOMEWORK",
      parentId: s.parent?.id,
      studentId: s.id,
      html: `<p>Dear ${s.parent?.user.name || "Parent"},</p>
        <p>New homework <b>${title}</b> has been assigned to ${s.user.name}.</p>
        <p>Deadline: <b>${formatDate(deadline)}</b>.</p>`,
    });
  }
}

export async function notifyFeeDue(studentId: string, title: string, amount: number, dueDate: string) {
  const info = await parentForStudent(studentId);
  if (!info?.email) return;
  await sendEmail({
    to: info.email,
    toName: info.parent?.user.name,
    subject: "Fee Due Reminder",
    category: "FEE",
    parentId: info.parent?.id,
    studentId,
    html: `<p>Dear ${info.parent?.user.name || "Parent"},</p>
      <p>This is a friendly reminder that the fee <b>${title}</b> of amount <b>₹${amount}</b> for ${info.student.user.name} is due by <b>${formatDate(dueDate)}</b>.</p>`,
  });
}

export async function notifyUpcomingTest(classId: string | null, title: string, accessCode: string, startTime: Date) {
  const students = await prisma.student.findMany({
    where: classId ? { classId } : {},
    include: { parent: { include: { user: true } }, user: true },
  });
  for (const s of students) {
    const email = s.parent?.user.email;
    if (!email) continue;
    await sendEmail({
      to: email,
      toName: s.parent?.user.name,
      subject: "Upcoming Test",
      category: "TEST",
      parentId: s.parent?.id,
      studentId: s.id,
      html: `<p>Dear ${s.parent?.user.name || "Parent"},</p>
        <p>An upcoming test <b>${title}</b> is scheduled for ${s.user.name}.</p>
        <p>Starts: <b>${formatDate(startTime)}</b>. Access code: <b>${accessCode}</b>.</p>`,
    });
  }
}

export async function notifyLeaveDecision(leaveId: string, status: "APPROVED" | "REJECTED", adminNote?: string) {
  const leave = await prisma.leaveRequest.findUnique({
    where: { id: leaveId },
    include: { student: { include: { user: true } }, parent: { include: { user: true } } },
  });
  if (!leave) return;
  const email = leave.parent?.user.email;
  if (!email) return;
  await sendEmail({
    to: email,
    toName: leave.parent?.user.name,
    subject: `Leave Request ${status}`,
    category: "LEAVE",
    parentId: leave.parent?.id,
    studentId: leave.studentId,
    html: `<p>Dear ${leave.parent?.user.name || "Parent"},</p>
      <p>Your leave request for <b>${leave.student.user.name}</b> (${formatDate(leave.fromDate)} - ${formatDate(leave.toDate)}) has been <b>${status}</b>.</p>
      ${adminNote ? `<p>Note: ${adminNote}</p>` : ""}`,
  });
}
