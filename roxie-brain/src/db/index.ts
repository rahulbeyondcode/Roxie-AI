import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

export const sqlDB = new Pool(dbConfig);

export const initDB = async () => {
  const client = await sqlDB.connect();

  try {
    // pgvector extension is required for vector similarity search.
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("PostgreSQL connected with pgvector enabled");
  } finally {
    client.release();
  }
};
