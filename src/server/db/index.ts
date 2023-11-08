import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env.mjs";

const client = postgres(env.DATABASE_URL);
export const db: PostgresJsDatabase = drizzle(client);
