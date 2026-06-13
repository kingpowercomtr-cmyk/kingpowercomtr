/**
 * Sadece admin kullanıcısı oluşturur / şifreyi günceller.
 * Çalıştır: npm run db:admin
 */
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "db.sqlite");
const ADMIN_TOKEN_SECRET = process.env.ADMIN_SECRET || "kingpower-admin-secret-2026";

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw + ADMIN_TOKEN_SECRET).digest("hex");
}

async function main() {
  const adapter = new PrismaBetterSqlite3({ url: DB_PATH });
  const prisma = new PrismaClient({ adapter });

  const username = "admin";
  const password = "kingpower2026";

  await prisma.adminUser.upsert({
    where: { username },
    update: { password: hashPassword(password) },
    create: {
      username,
      password: hashPassword(password),
    },
  });

  console.log("Admin hazır!");
  console.log("  Kullanıcı:", username);
  console.log("  Şifre:   ", password);
  console.log("  Giriş:    http://localhost:3000/admin/giris");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
