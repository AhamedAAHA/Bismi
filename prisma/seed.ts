import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hash = (p: string) => bcrypt.hash(p, 10);

function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
function dayStr(days: number) {
  return dateOffset(days).toISOString().slice(0, 10);
}

async function main() {
  console.log("Seeding 3D Education Hub...");

  // Clean
  await prisma.$transaction([
    prisma.emailNotification.deleteMany(),
    prisma.teacherComment.deleteMany(),
    prisma.receipt.deleteMany(),
    prisma.fee.deleteMany(),
    prisma.homeworkSubmission.deleteMany(),
    prisma.homework.deleteMany(),
    prisma.note.deleteMany(),
    prisma.result.deleteMany(),
    prisma.testAttempt.deleteMany(),
    prisma.question.deleteMany(),
    prisma.test.deleteMany(),
    prisma.qrAttendanceCode.deleteMany(),
    prisma.attendance.deleteMany(),
    prisma.leaveRequest.deleteMany(),
    prisma.schedule.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.setting.deleteMany(),
    prisma.student.deleteMany(),
    prisma.parent.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.class.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Admin
  await prisma.user.create({
    data: {
      email: "admin@3dedu.hub",
      password: await hash("admin123"),
      role: "ADMIN",
      name: "Hub Administrator",
    },
  });

  // Classes
  const grade9 = await prisma.class.create({
    data: { name: "Grade 9", section: "A", room: "R-101" },
  });
  const grade10 = await prisma.class.create({
    data: { name: "Grade 10", section: "A", room: "R-102" },
  });

  // Subjects
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: "Mathematics", code: "MATH", teacher: "Mr. Ravi", classId: grade10.id } }),
    prisma.subject.create({ data: { name: "Science", code: "SCI", teacher: "Ms. Anita", classId: grade10.id } }),
    prisma.subject.create({ data: { name: "English", code: "ENG", teacher: "Ms. Fatima", classId: grade10.id } }),
    prisma.subject.create({ data: { name: "Mathematics", code: "MATH9", teacher: "Mr. Ravi", classId: grade9.id } }),
  ]);
  const math = subjects[0];
  const science = subjects[1];

  // Parents
  async function makeParent(name: string, code: string, email: string) {
    const user = await prisma.user.create({
      data: { name, code, email, password: await hash("1234"), role: "PARENT" },
    });
    return prisma.parent.create({
      data: { userId: user.id, parentCode: code, phone: "9000000000", occupation: "Engineer", address: "City" },
    });
  }
  const parentA = await makeParent("Mr. Kumar", "PAR001", "parent1@example.com");
  const parentB = await makeParent("Mrs. Sharma", "PAR002", "parent2@example.com");

  // Students
  async function makeStudent(
    name: string,
    code: string,
    roll: string,
    classId: string,
    parentId: string,
    email: string
  ) {
    const user = await prisma.user.create({
      data: { name, code, email, password: await hash("1234"), role: "STUDENT" },
    });
    return prisma.student.create({
      data: {
        userId: user.id,
        studentCode: code,
        rollNo: roll,
        classId,
        parentId,
        phone: "8000000000",
        dob: "2009-05-12",
        address: "City",
      },
    });
  }
  const s1 = await makeStudent("Arjun Kumar", "STU001", "01", grade10.id, parentA.id, "student1@example.com");
  const s2 = await makeStudent("Priya Sharma", "STU002", "02", grade10.id, parentB.id, "student2@example.com");
  const s3 = await makeStudent("Rahul Verma", "STU003", "03", grade10.id, parentA.id, "student3@example.com");
  const students = [s1, s2, s3];

  // Attendance (last 20 days)
  for (const s of students) {
    for (let i = 20; i >= 1; i--) {
      const r = Math.random();
      const status = r > 0.85 ? "ABSENT" : r > 0.75 ? "LATE" : "PRESENT";
      await prisma.attendance.create({
        data: {
          studentId: s.id,
          date: dayStr(-i),
          status,
          checkIn: status === "ABSENT" ? null : status === "LATE" ? "09:25" : "08:55",
          checkOut: status === "ABSENT" ? null : "15:05",
          method: "MANUAL",
        },
      });
    }
  }

  // Today's QR code
  await prisma.qrAttendanceCode.create({
    data: {
      code: "QR" + dayStr(0).replace(/-/g, ""),
      date: dayStr(0),
      expiresAt: dateOffset(1),
      active: true,
    },
  });

  // Test with questions (active now)
  const test = await prisma.test.create({
    data: {
      title: "Algebra Basics",
      description: "Quick MCQ test on algebra fundamentals.",
      accessCode: "MATH2026",
      classId: grade10.id,
      subjectId: math.id,
      durationMin: 20,
      totalMarks: 4,
      startTime: dateOffset(-1),
      endTime: dateOffset(7),
      published: true,
    },
  });
  const sciTest = await prisma.test.create({
    data: {
      title: "Science Quiz",
      description: "Basics of physics and biology.",
      accessCode: "SCI2026",
      classId: grade10.id,
      subjectId: science.id,
      durationMin: 15,
      totalMarks: 3,
      startTime: dateOffset(-1),
      endTime: dateOffset(10),
      published: true,
    },
  });

  const qs = [
    { text: "What is the value of x in 2x + 4 = 10?", options: ["2", "3", "4", "5"], correct: 1, marks: 1 },
    { text: "Simplify: (a^2)(a^3)", options: ["a^5", "a^6", "a", "a^8"], correct: 0, marks: 1 },
    { text: "Solve: 5(2) - 3", options: ["7", "10", "13", "5"], correct: 0, marks: 1 },
    { text: "If y = 3x and x = 2, find y", options: ["5", "6", "9", "8"], correct: 1, marks: 1 },
  ];
  for (let i = 0; i < qs.length; i++) {
    await prisma.question.create({
      data: {
        testId: test.id,
        text: qs[i].text,
        options: JSON.stringify(qs[i].options),
        correct: qs[i].correct,
        marks: qs[i].marks,
        order: i,
      },
    });
  }
  const sciQs = [
    { text: "Water is made of hydrogen and?", options: ["Oxygen", "Carbon", "Nitrogen", "Helium"], correct: 0 },
    { text: "Plants make food through?", options: ["Respiration", "Photosynthesis", "Digestion", "Osmosis"], correct: 1 },
    { text: "Unit of force is?", options: ["Joule", "Watt", "Newton", "Pascal"], correct: 2 },
  ];
  for (let i = 0; i < sciQs.length; i++) {
    await prisma.question.create({
      data: {
        testId: sciTest.id,
        text: sciQs[i].text,
        options: JSON.stringify(sciQs[i].options),
        correct: sciQs[i].correct,
        marks: 1,
        order: i,
      },
    });
  }

  // Results (manual marks) for progress charts
  const months = ["Jan", "Feb", "Mar", "Apr"];
  for (const s of students) {
    for (let m = 0; m < months.length; m++) {
      await prisma.result.create({
        data: {
          studentId: s.id,
          title: `${months[m]} Math Test`,
          subject: "Mathematics",
          score: 60 + Math.floor(Math.random() * 35),
          total: 100,
          type: "MANUAL",
          date: dayStr(-(120 - m * 30)),
        },
      });
      await prisma.result.create({
        data: {
          studentId: s.id,
          title: `${months[m]} Science Test`,
          subject: "Science",
          score: 55 + Math.floor(Math.random() * 40),
          total: 100,
          type: "MANUAL",
          date: dayStr(-(120 - m * 30)),
        },
      });
    }
  }

  // Homework
  const hw = await prisma.homework.create({
    data: {
      title: "Algebra Worksheet 1",
      description: "Complete questions 1-10 from chapter 3.",
      classId: grade10.id,
      subjectId: math.id,
      deadline: dateOffset(3),
    },
  });
  await prisma.homework.create({
    data: {
      title: "Science Reading",
      description: "Read chapter 5 and summarize.",
      classId: grade10.id,
      subjectId: science.id,
      deadline: dateOffset(5),
    },
  });
  await prisma.homeworkSubmission.create({
    data: {
      homeworkId: hw.id,
      studentId: s1.id,
      fileUrl: "/uploads/sample-submission.txt",
      note: "Completed all questions.",
      status: "SUBMITTED",
    },
  });

  // Notes
  await prisma.note.create({
    data: {
      title: "Algebra Formulas",
      description: "Key formulas for the unit.",
      classId: grade10.id,
      subjectId: math.id,
      fileUrl: "/uploads/algebra-notes.txt",
    },
  });
  await prisma.note.create({
    data: {
      title: "Photosynthesis Notes",
      description: "Detailed notes on photosynthesis.",
      classId: grade10.id,
      subjectId: science.id,
      fileUrl: "/uploads/science-notes.txt",
    },
  });

  // Fees
  for (const s of students) {
    const paid = await prisma.fee.create({
      data: {
        studentId: s.id,
        title: "Tuition Fee - March",
        amount: 3000,
        amountPaid: 3000,
        status: "PAID",
        dueDate: dayStr(-30),
        paidDate: dayStr(-28),
        method: "Cash",
      },
    });
    await prisma.receipt.create({
      data: {
        feeId: paid.id,
        receiptNo: "RCPT-" + Math.floor(100000 + Math.random() * 900000),
        amount: 3000,
        method: "Cash",
        date: dayStr(-28),
      },
    });
    await prisma.fee.create({
      data: {
        studentId: s.id,
        title: "Tuition Fee - April",
        amount: 3000,
        amountPaid: 0,
        status: "DUE",
        dueDate: dayStr(5),
      },
    });
  }

  // Schedule
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = [
    { subject: math, start: "09:00", end: "10:00", teacher: "Mr. Ravi" },
    { subject: science, start: "10:15", end: "11:15", teacher: "Ms. Anita" },
    { subject: subjects[2], start: "11:30", end: "12:30", teacher: "Ms. Fatima" },
  ];
  for (const day of days) {
    for (const slot of slots) {
      await prisma.schedule.create({
        data: {
          classId: grade10.id,
          subjectId: slot.subject.id,
          day,
          startTime: slot.start,
          endTime: slot.end,
          teacher: slot.teacher,
          room: "R-102",
        },
      });
    }
  }

  // Teacher comments
  await prisma.teacherComment.create({
    data: { studentId: s1.id, teacher: "Mr. Ravi", comment: "Excellent progress in algebra. Keep it up!", date: dayStr(-2) },
  });
  await prisma.teacherComment.create({
    data: { studentId: s2.id, teacher: "Ms. Anita", comment: "Needs to focus more in science class.", date: dayStr(-4) },
  });

  // Leave requests
  await prisma.leaveRequest.create({
    data: {
      studentId: s1.id,
      parentId: parentA.id,
      type: "SICK",
      reason: "Fever and cold.",
      fromDate: dayStr(1),
      toDate: dayStr(2),
      status: "PENDING",
    },
  });

  // Announcements
  await prisma.announcement.create({
    data: { title: "Welcome to 3D Education Hub", body: "New online test system is now live. Check the Tests page!", audience: "ALL" },
  });
  await prisma.announcement.create({
    data: { title: "Parent Meeting", body: "Monthly parent meeting scheduled for next Saturday at 10 AM.", audience: "PARENT" },
  });

  // Settings
  await prisma.setting.createMany({
    data: [
      { key: "centerName", value: "3D Education Hub" },
      { key: "lateThreshold", value: "09:15" },
      { key: "academicYear", value: "2025-2026" },
    ],
  });

  console.log("Seed complete.");
  console.log("Admin login:   admin@3dedu.hub / admin123");
  console.log("Student login: STU001 / 1234");
  console.log("Parent login:  PAR001 / 1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
