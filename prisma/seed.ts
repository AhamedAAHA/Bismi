import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding base data...");

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@3dedu.hub";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const adminName = process.env.SEED_ADMIN_NAME || "Administrator";
  const parentCode = process.env.SEED_PARENT_CODE || "PARENT";
  const parentPassword = process.env.SEED_PARENT_PASSWORD || "parent123";
  const parentName = process.env.SEED_PARENT_NAME || "Parent Portal";

  // Remove all academic/sample data so production starts clean.
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
    prisma.student.deleteMany(),
    prisma.parent.deleteMany(),
    prisma.subject.deleteMany(),
    prisma.class.deleteMany(),
    prisma.setting.deleteMany(),
    prisma.user.deleteMany({ where: { role: { not: "ADMIN" } } }),
  ]);

  const hashed = await bcrypt.hash(adminPassword, 10);
  const parentHashed = await bcrypt.hash(parentPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      role: "ADMIN",
      active: true,
      password: hashed,
    },
    create: {
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
      name: adminName,
      active: true,
    },
  });

  const parentUser = await prisma.user.upsert({
    where: { code: parentCode },
    update: {
      name: parentName,
      role: "PARENT",
      active: true,
      password: parentHashed,
    },
    create: {
      code: parentCode,
      password: parentHashed,
      role: "PARENT",
      name: parentName,
      active: true,
    },
  });

  await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {
      parentCode,
      phone: null,
      occupation: "Shared Parent Access",
      address: null,
    },
    create: {
      userId: parentUser.id,
      parentCode,
      phone: null,
      occupation: "Shared Parent Access",
      address: null,
    },
  });

  await prisma.setting.createMany({
    data: [
      { key: "centerName", value: "Bismi Education OS" },
      { key: "lateThreshold", value: "09:15" },
      { key: "academicYear", value: "2026-2027" },
    ],
  });

  console.log("Seed complete. Demo students/marks were not created.");
  console.log(`Admin login email: ${adminEmail}`);
  console.log(`Parent login code: ${parentCode}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
