import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const POSTGRES_URL =
  process.env.POSTGRES_URL || "postgresql://postgres:postgres@localhost:5432/roxie";

export const sqlDB = new Pool({
  connectionString: POSTGRES_URL,
});

const initDB = async () => {
  const client = await sqlDB.connect();

  try {
    // pgvector extension is required for vector similarity search.
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("PostgreSQL connected with pgvector enabled ✅");
  } finally {
    client.release();
  }
};

try {
  await initDB();
} catch (error) {
  console.error("PostgreSQL connection error:", error);
}
