/**
 * Admin kullanıcısı oluşturur (Prisma/better-sqlite3 gerektirmez).
 * Çalıştır: npm run db:admin
 */
import { DatabaseSync } from "node:sqlite";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "db.sqlite");
const ADMIN_TOKEN_SECRET = process.env.ADMIN_SECRET || "kingpower-admin-secret-2026";

function hashPassword(pw) {
  return crypto.createHash("sha256").update(pw + ADMIN_TOKEN_SECRET).digest("hex");
}

const username = "admin";
const password = "kingpower2026";
const hashed = hashPassword(password);
const now = new Date().toISOString();

if (!fs.existsSync(DB_PATH)) {
  console.error("db.sqlite bulunamadı. Önce şunu çalıştır:");
  console.error("  npx prisma migrate deploy");
  process.exit(1);
}

const db = new DatabaseSync(DB_PATH);

// AdminUser tablosu yoksa oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "AdminUser_username_key" ON "AdminUser"("username");
`);

const existing = db.prepare('SELECT id FROM "AdminUser" WHERE username = ?').get(username);

if (existing) {
  db.prepare('UPDATE "AdminUser" SET password = ? WHERE username = ?').run(hashed, username);
  console.log("Mevcut admin şifresi güncellendi.");
} else {
  db.prepare(
    'INSERT INTO "AdminUser" (username, password, createdAt) VALUES (?, ?, ?)'
  ).run(username, hashed, now);
  console.log("Yeni admin kullanıcısı oluşturuldu.");
}

console.log("");
console.log("  Kullanıcı: admin");
console.log("  Şifre:     kingpower2026");
console.log("  Giriş:     http://localhost:3000/admin/giris");

db.close();
