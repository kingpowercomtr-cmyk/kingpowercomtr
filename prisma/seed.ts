import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import crypto from "crypto";
import { PACKAGES } from "../src/lib/packages";

const DB_PATH = path.join(process.cwd(), "db.sqlite");
const adapter = new PrismaBetterSqlite3({ url: DB_PATH });
const prisma = new PrismaClient({ adapter });

const ADMIN_TOKEN_SECRET = "kingpower-admin-secret-2026";

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw + ADMIN_TOKEN_SECRET).digest("hex");
}

async function main() {
  console.log("Seeding database...");

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashPassword("kingpower2026"),
    },
  });
  console.log("Admin user: admin / kingpower2026");

  const statuses = ["yeni_siparis", "onaylandi", "kargolandı", "iade"];
  const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Adana", "Antalya", "Konya"];
  const names = [
    "Mehmet Yılmaz",
    "Ahmet Kaya",
    "Burak Demir",
    "Serkan Çelik",
    "Murat Arslan",
    "Hakan Şahin",
    "Emre Özkan",
  ];

  for (let i = 0; i < 25; i++) {
    const pkg = PACKAGES[i % PACKAGES.length];
    const code = `KP-260601-${100 + i}`;
    const existing = await prisma.order.findUnique({ where: { code } });
    if (!existing) {
      await prisma.order.create({
        data: {
          code,
          fullName: names[i % names.length],
          phone: `+905${Math.floor(100000000 + Math.random() * 899999999)}`,
          city: cities[i % cities.length],
          district: "Merkez",
          address: `Örnek Mahallesi, ${i + 1}. Sokak No:${i + 1}`,
          paymentType: i % 2 === 0 ? "nakit" : "kart",
          packageType: pkg.key,
          packageLabel: pkg.packageLabel,
          price: pkg.price,
          status: statuses[i % statuses.length],
          cargoCompany: i % 3 === 0 ? "Aras Kargo" : null,
          trackingCode: i % 3 === 0 ? `AR${1000000 + i}` : null,
          createdAt: new Date(Date.now() - (i * 4 + Math.random() * 3) * 3600000),
        },
      });
    }
  }
  console.log("Sample orders created.");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
