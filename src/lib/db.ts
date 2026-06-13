const DB_URL = process.env.DATABASE_URL!;
const DB_TOKEN = process.env.TURSO_AUTH_TOKEN!;

export async function dbExecute(sql: string, args: any[] = []) {
  const res = await fetch(`${DB_URL}/v2/pipeline`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [{ type: "execute", stmt: { sql, args: args.map(a => a === null ? { type: "null" } : { type: "text", value: String(a) }) } }, { type: "close" }],
    }),
  });
  const data = await res.json();
  const result = data.results?.[0]?.response?.result;
  const cols = result?.cols?.map((c: any) => c.name) ?? [];
  const rows = result?.rows?.map((row: any[]) => Object.fromEntries(row.map((v, i) => [cols[i], v?.value ?? null]))) ?? [];
  return { rows };
}

export const db = { execute: (q: { sql: string; args?: any[] } | string, args?: any[]) => {
  if (typeof q === "string") return dbExecute(q, args);
  return dbExecute(q.sql, q.args);
}};