const DB_URL = process.env.DATABASE_URL!;
const DB_TOKEN = process.env.TURSO_AUTH_TOKEN!;

export const db = {
  execute: async (query: { sql: string; args?: any[] } | string, args?: any[]) => {
    const sql = typeof query === "string" ? query : query.sql;
    const queryArgs = typeof query === "string" ? (args || []) : (query.args || []);
    
    const res = await fetch(`${DB_URL}/v2/pipeline`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql, args: queryArgs.map((a: any) => a === null ? { type: "null" } : { type: "text", value: String(a) }) } },
          { type: "close" }
        ],
      }),
    });
    
    const data = await res.json();
    const result = data.results?.[0]?.response?.result;
    const cols = result?.cols?.map((c: any) => c.name) ?? [];
    const rows = result?.rows?.map((row: any[]) => Object.fromEntries(row.map((v: any, i: number) => [cols[i], v?.value ?? null]))) ?? [];
    return { rows };
  }
};