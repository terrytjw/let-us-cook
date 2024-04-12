import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);

// import { neon, neonConfig } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

// neonConfig.fetchConnectionCache = true;

// if (!process.env.DATABASE_URL) {
//   throw new Error("DB url not found!");
// }

// const sql = neon(process.env.DATABASE_URL);

// export const db = drizzle(sql);
