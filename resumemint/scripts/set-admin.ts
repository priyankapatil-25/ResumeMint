import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL_TCP || "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";
const pool = new pg.Pool({ connectionString, max: 1 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2];

  if (!email) {
    // List all users
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    console.log("\n=== All Users ===");
    users.forEach((u, i) => console.log(`${i + 1}. ${u.name} (${u.email}) - Role: ${u.role}`));
    console.log("\nTo set admin, run: npx tsx scripts/set-admin.ts <email>");
  } else {
    // Set user as admin
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log(`\nUser "${user.name}" (${user.email}) is now ADMIN!`);
  }
}

main().catch(console.error).finally(() => { pool.end(); process.exit(0); });
