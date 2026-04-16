import { prisma } from "./app/prisma";

async function main() {
  // 1️⃣ Insert a sample employer
  const employer = await prisma.employers.create({
    data: {
      company_name: "Techify Inc.",
      contact_email: "hr@techify.com",
      password_hash: "test123",
    },
  });

  console.log("✅ Employer created:", employer);

  // 2️⃣ Fetch all employers
  const allEmployers = await prisma.employers.findMany();
  console.log("📦 All Employers:", allEmployers);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });