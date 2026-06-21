import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

async function clearDatabase() {
  await prisma.emailNotification.deleteMany();
  await prisma.teacherComment.deleteMany();
  await prisma.receipt.deleteMany();
  await prisma.fee.deleteMany();
  await prisma.homeworkSubmission.deleteMany();
  await prisma.homework.deleteMany();
  await prisma.note.deleteMany();
  await prisma.result.deleteMany();
  await prisma.testAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.test.deleteMany();
  await prisma.qrAttendanceCode.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log("Seeding Bismi Education OS demo data...");

  await clearDatabase();

  const adminPassword = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || "admin123",
    10
  );
  const parentPassword = await bcrypt.hash(
    process.env.SEED_PARENT_PASSWORD || "parent123",
    10
  );
  const studentPassword = await bcrypt.hash("student123", 10);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@bismi.edu";
  const parentCode = process.env.SEED_PARENT_CODE || "PARENT";

  // ---- Settings ----
  await prisma.setting.createMany({
    data: [
      { key: "centerName", value: "Bismi Education OS" },
      { key: "lateThreshold", value: "09:15" },
      { key: "academicYear", value: "2026-2027" },
      { key: "address", value: "12 Knowledge Park, Chennai, Tamil Nadu 600028" },
      { key: "phone", value: "+91 44 2345 6789" },
    ],
  });

  // ---- Admin ----
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      password: adminPassword,
      role: "ADMIN",
      name: process.env.SEED_ADMIN_NAME || "Dr. Aisha Rahman",
      active: true,
    },
  });

  // ---- Classes ----
  const class10A = await prisma.class.create({
    data: { name: "Grade 10", section: "A", room: "Room 201" },
  });
  const class10B = await prisma.class.create({
    data: { name: "Grade 10", section: "B", room: "Room 202" },
  });
  const class11Sci = await prisma.class.create({
    data: { name: "Grade 11", section: "Science", room: "Lab Block 1" },
  });

  // ---- Subjects ----
  const subjects10A = await Promise.all([
    prisma.subject.create({
      data: { name: "Mathematics", code: "MATH10", teacher: "Mr. Karthik", classId: class10A.id },
    }),
    prisma.subject.create({
      data: { name: "Physics", code: "PHY10", teacher: "Ms. Priya", classId: class10A.id },
    }),
    prisma.subject.create({
      data: { name: "Chemistry", code: "CHE10", teacher: "Dr. Venkat", classId: class10A.id },
    }),
    prisma.subject.create({
      data: { name: "English", code: "ENG10", teacher: "Mrs. Lakshmi", classId: class10A.id },
    }),
  ]);

  const subjects10B = await Promise.all([
    prisma.subject.create({
      data: { name: "Mathematics", code: "MATH10B", teacher: "Mr. Karthik", classId: class10B.id },
    }),
    prisma.subject.create({
      data: { name: "Biology", code: "BIO10", teacher: "Dr. Meena", classId: class10B.id },
    }),
    prisma.subject.create({
      data: { name: "Tamil", code: "TAM10", teacher: "Mr. Selvam", classId: class10B.id },
    }),
  ]);

  const subjects11Sci = await Promise.all([
    prisma.subject.create({
      data: { name: "Advanced Mathematics", code: "MATH11", teacher: "Mr. Karthik", classId: class11Sci.id },
    }),
    prisma.subject.create({
      data: { name: "Physics", code: "PHY11", teacher: "Ms. Priya", classId: class11Sci.id },
    }),
    prisma.subject.create({
      data: { name: "Computer Science", code: "CS11", teacher: "Mr. Arjun", classId: class11Sci.id },
    }),
  ]);

  const [math10A, physics10A, chem10A, eng10A] = subjects10A;
  const [math10B, bio10B] = subjects10B;
  const [math11, physics11, cs11] = subjects11Sci;

  // ---- Shared parent portal account ----
  const sharedParentUser = await prisma.user.create({
    data: {
      code: parentCode,
      email: `${parentCode.toLowerCase()}@parents.bismi.local`,
      password: parentPassword,
      role: "PARENT",
      name: process.env.SEED_PARENT_NAME || "Parent Portal",
      active: true,
    },
  });
  const sharedParent = await prisma.parent.create({
    data: {
      userId: sharedParentUser.id,
      parentCode,
      phone: "+91 98765 43210",
      occupation: "Shared Parent Access",
      address: "Chennai, Tamil Nadu",
    },
  });

  // ---- Individual parent (Fatima's mother) ----
  const fatimaParentUser = await prisma.user.create({
    data: {
      code: "PAR001",
      email: "par001@parents.bismi.local",
      password: parentPassword,
      role: "PARENT",
      name: "Sara Ali",
      active: true,
    },
  });
  const fatimaParent = await prisma.parent.create({
    data: {
      userId: fatimaParentUser.id,
      parentCode: "PAR001",
      phone: "+91 98401 22334",
      occupation: "Software Engineer",
      address: "Anna Nagar, Chennai",
    },
  });

  // ---- Students ----
  type StudentSeed = {
    code: string;
    name: string;
    rollNo: string;
    classId: string;
    parentId: string;
    phone: string;
    dob: string;
    address: string;
  };

  const studentSeeds: StudentSeed[] = [
    {
      code: "STU001",
      name: "Ahmed Hassan",
      rollNo: "10A-01",
      classId: class10A.id,
      parentId: sharedParent.id,
      phone: "+91 90001 10001",
      dob: "2010-03-15",
      address: "T Nagar, Chennai",
    },
    {
      code: "STU002",
      name: "Fatima Ali",
      rollNo: "10A-02",
      classId: class10A.id,
      parentId: fatimaParent.id,
      phone: "+91 90001 10002",
      dob: "2010-07-22",
      address: "Anna Nagar, Chennai",
    },
    {
      code: "STU003",
      name: "Omar Khan",
      rollNo: "10B-01",
      classId: class10B.id,
      parentId: sharedParent.id,
      phone: "+91 90001 10003",
      dob: "2010-01-08",
      address: "Velachery, Chennai",
    },
    {
      code: "STU004",
      name: "Aisha Rahman",
      rollNo: "11S-01",
      classId: class11Sci.id,
      parentId: sharedParent.id,
      phone: "+91 90001 10004",
      dob: "2009-11-30",
      address: "Adyar, Chennai",
    },
    {
      code: "STU005",
      name: "Yusuf Ibrahim",
      rollNo: "11S-02",
      classId: class11Sci.id,
      parentId: sharedParent.id,
      phone: "+91 90001 10005",
      dob: "2009-05-18",
      address: "OMR, Chennai",
    },
  ];

  const students = [];
  for (const s of studentSeeds) {
    const user = await prisma.user.create({
      data: {
        code: s.code,
        email: `${s.code.toLowerCase()}@students.bismi.local`,
        password: studentPassword,
        role: "STUDENT",
        name: s.name,
        active: true,
      },
    });
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        studentCode: s.code,
        rollNo: s.rollNo,
        classId: s.classId,
        parentId: s.parentId,
        phone: s.phone,
        dob: s.dob,
        address: s.address,
      },
    });
    students.push(student);
  }

  const [ahmed, fatima, omar, aisha, yusuf] = students;

  // ---- Weekly schedule (Grade 10-A sample) ----
  const scheduleSlots = [
    { day: "Monday", startTime: "09:00", endTime: "10:00", subjectId: math10A.id, teacher: "Mr. Karthik", room: "201" },
    { day: "Monday", startTime: "10:15", endTime: "11:15", subjectId: physics10A.id, teacher: "Ms. Priya", room: "201" },
    { day: "Tuesday", startTime: "09:00", endTime: "10:00", subjectId: chem10A.id, teacher: "Dr. Venkat", room: "Lab 1" },
    { day: "Wednesday", startTime: "09:00", endTime: "10:00", subjectId: eng10A.id, teacher: "Mrs. Lakshmi", room: "201" },
    { day: "Thursday", startTime: "09:00", endTime: "10:00", subjectId: math10A.id, teacher: "Mr. Karthik", room: "201" },
    { day: "Friday", startTime: "09:00", endTime: "10:00", subjectId: physics10A.id, teacher: "Ms. Priya", room: "201" },
  ];
  for (const slot of scheduleSlots) {
    await prisma.schedule.create({
      data: { ...slot, classId: class10A.id },
    });
  }

  // ---- Attendance (last 10 school days) ----
  const attendanceStatuses = ["PRESENT", "PRESENT", "PRESENT", "LATE", "PRESENT", "ABSENT", "PRESENT", "PRESENT", "PRESENT", "LEAVE"];
  for (let i = 0; i < 10; i++) {
    const date = daysAgo(10 - i);
    for (const [idx, student] of students.entries()) {
      const status = attendanceStatuses[(i + idx) % attendanceStatuses.length];
      await prisma.attendance.create({
        data: {
          studentId: student.id,
          date,
          status,
          checkIn: status === "ABSENT" ? null : status === "LATE" ? "09:25" : "08:55",
          checkOut: status === "ABSENT" ? null : "15:30",
          method: i % 3 === 0 ? "QR" : "MANUAL",
        },
      });
    }
  }

  // ---- Tests with questions ----
  const mathTest = await prisma.test.create({
    data: {
      title: "Mathematics Unit Test 3 — Quadratic Equations",
      description: "Covers chapters 5–6: factorisation, quadratic formula, and word problems.",
      accessCode: "MATH10U3",
      classId: class10A.id,
      subjectId: math10A.id,
      durationMin: 45,
      totalMarks: 20,
      startTime: daysFromNow(-7),
      endTime: daysFromNow(14),
      published: true,
    },
  });

  const mathQuestions = [
    {
      text: "What is the sum of roots of x² − 5x + 6 = 0?",
      options: JSON.stringify(["5", "6", "−5", "−6"]),
      correct: 0,
      marks: 5,
      order: 1,
    },
    {
      text: "Which method is best to solve x² − 9 = 0?",
      options: JSON.stringify(["Quadratic formula", "Square root property", "Completing the square", "Graphing only"]),
      correct: 1,
      marks: 5,
      order: 2,
    },
    {
      text: "The discriminant of 2x² + 3x + 5 = 0 is:",
      options: JSON.stringify(["−31", "31", "9", "49"]),
      correct: 0,
      marks: 5,
      order: 3,
    },
    {
      text: "If one root of x² − kx + 12 = 0 is 3, then k equals:",
      options: JSON.stringify(["7", "4", "12", "3"]),
      correct: 0,
      marks: 5,
      order: 4,
    },
  ];

  const createdMathQuestions = [];
  for (const q of mathQuestions) {
    createdMathQuestions.push(
      await prisma.question.create({ data: { ...q, testId: mathTest.id } })
    );
  }

  const physicsTest = await prisma.test.create({
    data: {
      title: "Physics — Light & Reflection",
      description: "Mirrors, lenses, and ray diagrams.",
      accessCode: "PHY10L1",
      classId: class10A.id,
      subjectId: physics10A.id,
      durationMin: 30,
      totalMarks: 15,
      startTime: daysFromNow(-3),
      endTime: daysFromNow(10),
      published: true,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        testId: physicsTest.id,
        text: "The angle of incidence equals the angle of reflection. This is:",
        options: JSON.stringify(["Snell's law", "Law of reflection", "Huygens principle", "Total internal reflection"]),
        correct: 1,
        marks: 5,
        order: 1,
      },
      {
        testId: physicsTest.id,
        text: "A concave mirror can produce a real, inverted image when the object is placed:",
        options: JSON.stringify(["At focus", "Between P and F", "Beyond C", "At pole"]),
        correct: 2,
        marks: 5,
        order: 2,
      },
      {
        testId: physicsTest.id,
        text: "Power of a lens is measured in:",
        options: JSON.stringify(["Watts", "Dioptre", "Lux", "Candela"]),
        correct: 1,
        marks: 5,
        order: 3,
      },
    ],
  });

  // ---- Test attempts & results ----
  const ahmedAnswers: Record<string, number> = {};
  createdMathQuestions.forEach((q, i) => {
    ahmedAnswers[q.id] = i === 2 ? 2 : q.correct; // one wrong answer
  });

  await prisma.testAttempt.create({
    data: {
      testId: mathTest.id,
      studentId: ahmed.id,
      answers: JSON.stringify(ahmedAnswers),
      score: 15,
      total: 20,
      submitted: true,
      submittedAt: daysFromNow(-5),
    },
  });

  await prisma.result.create({
    data: {
      studentId: ahmed.id,
      testId: mathTest.id,
      title: "Mathematics Unit Test 3",
      subject: "Mathematics",
      score: 15,
      total: 20,
      type: "TEST",
      date: daysAgo(5),
    },
  });

  await prisma.result.create({
    data: {
      studentId: fatima.id,
      testId: mathTest.id,
      title: "Mathematics Unit Test 3",
      subject: "Mathematics",
      score: 18,
      total: 20,
      type: "TEST",
      date: daysAgo(5),
    },
  });

  await prisma.result.create({
    data: {
      studentId: omar.id,
      title: "Biology Mid-Term",
      subject: "Biology",
      score: 72,
      total: 100,
      type: "MANUAL",
      date: daysAgo(12),
    },
  });

  await prisma.result.create({
    data: {
      studentId: aisha.id,
      title: "Computer Science Project",
      subject: "Computer Science",
      score: 92,
      total: 100,
      type: "MANUAL",
      date: daysAgo(8),
    },
  });

  // ---- Homework ----
  const hw1 = await prisma.homework.create({
    data: {
      title: "Quadratic Equations Worksheet",
      description: "Complete exercises 5.1 to 5.3 from the textbook. Show all working.",
      classId: class10A.id,
      subjectId: math10A.id,
      deadline: daysFromNow(3),
    },
  });

  const hw2 = await prisma.homework.create({
    data: {
      title: "Ray Diagrams — Concave & Convex Mirrors",
      description: "Draw ray diagrams for 5 standard positions of object in front of concave mirror.",
      classId: class10A.id,
      subjectId: physics10A.id,
      deadline: daysFromNow(5),
    },
  });

  await prisma.homework.create({
    data: {
      title: "Python Functions Assignment",
      description: "Write 5 programs using user-defined functions and list comprehensions.",
      classId: class11Sci.id,
      subjectId: cs11.id,
      deadline: daysFromNow(7),
    },
  });

  await prisma.homeworkSubmission.create({
    data: {
      homeworkId: hw1.id,
      studentId: ahmed.id,
      fileUrl: "/uploads/homework/ahmed-quadratic.pdf",
      note: "Submitted on time",
      status: "GRADED",
      grade: "A",
    },
  });

  await prisma.homeworkSubmission.create({
    data: {
      homeworkId: hw1.id,
      studentId: fatima.id,
      fileUrl: "/uploads/homework/fatima-quadratic.pdf",
      status: "GRADED",
      grade: "A+",
    },
  });

  await prisma.homeworkSubmission.create({
    data: {
      homeworkId: hw2.id,
      studentId: ahmed.id,
      fileUrl: "/uploads/homework/ahmed-ray-diagrams.pdf",
      status: "SUBMITTED",
    },
  });

  // ---- Study notes ----
  await prisma.note.createMany({
    data: [
      {
        title: "Quadratic Equations — Formula Sheet",
        description: "Key formulas, discriminant rules, and solved examples.",
        classId: class10A.id,
        subjectId: math10A.id,
        fileUrl: "/uploads/notes/quadratic-formula-sheet.pdf",
      },
      {
        title: "Light — Reflection & Refraction Summary",
        description: "One-page revision notes for board exam prep.",
        classId: class10A.id,
        subjectId: physics10A.id,
        fileUrl: "/uploads/notes/light-summary.pdf",
      },
      {
        title: "Python OOP Basics",
        description: "Classes, objects, inheritance with code snippets.",
        classId: class11Sci.id,
        subjectId: cs11.id,
        fileUrl: "/uploads/notes/python-oop.pdf",
      },
    ],
  });

  // ---- Fees ----
  const fee1 = await prisma.fee.create({
    data: {
      studentId: ahmed.id,
      title: "Term 2 Tuition Fee",
      amount: 15000,
      amountPaid: 15000,
      status: "PAID",
      dueDate: daysAgo(30),
      paidDate: daysAgo(28),
      method: "UPI",
    },
  });

  await prisma.receipt.create({
    data: {
      feeId: fee1.id,
      receiptNo: "BIS-2026-0042",
      amount: 15000,
      method: "UPI",
      date: daysAgo(28),
    },
  });

  await prisma.fee.create({
    data: {
      studentId: fatima.id,
      title: "Term 2 Tuition Fee",
      amount: 15000,
      amountPaid: 7500,
      status: "PARTIAL",
      dueDate: daysAgo(15),
      paidDate: daysAgo(10),
      method: "Bank Transfer",
    },
  });

  await prisma.fee.create({
    data: {
      studentId: omar.id,
      title: "Term 2 Tuition Fee",
      amount: 15000,
      amountPaid: 0,
      status: "DUE",
      dueDate: daysFromNow(5).toISOString().slice(0, 10),
    },
  });

  // ---- Leave request ----
  await prisma.leaveRequest.create({
    data: {
      studentId: yusuf.id,
      parentId: sharedParent.id,
      type: "SICK",
      reason: "Fever and doctor advised 2 days rest.",
      fromDate: daysAgo(2),
      toDate: daysAgo(1),
      status: "APPROVED",
      adminNote: "Get well soon. Share medical certificate on return.",
    },
  });

  await prisma.leaveRequest.create({
    data: {
      studentId: omar.id,
      parentId: sharedParent.id,
      type: "VACATION",
      reason: "Family wedding out of town.",
      fromDate: daysFromNow(10).toISOString().slice(0, 10),
      toDate: daysFromNow(12).toISOString().slice(0, 10),
      status: "PENDING",
    },
  });

  // ---- Teacher comments ----
  await prisma.teacherComment.createMany({
    data: [
      {
        studentId: ahmed.id,
        teacher: "Mr. Karthik",
        comment: "Strong in algebra. Needs to improve accuracy in word problems.",
        date: daysAgo(3),
      },
      {
        studentId: fatima.id,
        teacher: "Mrs. Lakshmi",
        comment: "Excellent essay writing skills. Consistently top of the class.",
        date: daysAgo(5),
      },
      {
        studentId: aisha.id,
        teacher: "Mr. Arjun",
        comment: "Outstanding programming project. Consider participating in the coding club.",
        date: daysAgo(2),
      },
    ],
  });

  // ---- Announcements ----
  await prisma.announcement.createMany({
    data: [
      {
        title: "Parent-Teacher Meeting — March 28",
        body: "All parents are invited to the quarterly PTM on Saturday, 28 March 2026, 10:00 AM at the main auditorium. Please confirm attendance via the parent portal.",
        audience: "PARENT",
      },
      {
        title: "Science Fair Registration Open",
        body: "Grade 10 & 11 students can register for the annual Science Fair by 15 April. Submit your project title to your class teacher.",
        audience: "STUDENT",
      },
      {
        title: "Holiday Notice — Tamil New Year",
        body: "The centre will remain closed on 14 April 2026 for Tamil New Year. Regular classes resume on 15 April.",
        audience: "ALL",
      },
    ],
  });

  // ---- QR attendance code for today ----
  await prisma.qrAttendanceCode.create({
    data: {
      code: "BISMI-QR-" + daysAgo(0).replace(/-/g, ""),
      date: daysAgo(0),
      expiresAt: daysFromNow(1),
      active: true,
    },
  });

  console.log("\n✅ Seed complete!\n");
  console.log("── Login credentials ──");
  console.log(`Admin:   ${adminEmail} / admin123`);
  console.log(`Parent:  PARENT / parent123  (shared — sees Ahmed, Omar, Aisha, Yusuf)`);
  console.log(`Parent:  PAR001 / parent123  (Sara Ali — sees Fatima only)`);
  console.log(`Students: STU001–STU005 / student123`);
  console.log(`\nAdmin user id: ${adminUser.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
