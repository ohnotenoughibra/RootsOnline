import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function makeAdmin() {
  const email = "ibrahimallaouibeng@gmail.com";

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    console.log("User not found with email:", email);
    console.log("\nExisting users:");
    const users = await prisma.user.findMany({ select: { email: true, role: true } });
    users.forEach((u: { email: string; role: string }) => console.log(`  - ${u.email} (${u.role})`));
    return;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });

  console.log("✅ User promoted to ADMIN:");
  console.log(`   Email: ${updated.email}`);
  console.log(`   Role: ${updated.role}`);
}

makeAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
