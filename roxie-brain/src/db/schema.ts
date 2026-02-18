import { Pool } from "pg";

export const createTables = async (pool: Pool) => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        embedding vector(1024),
        created_at TIMESTAMP DEFAULT NOW(),
        usage_count INTEGER DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS data_store (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES categories(id),
        data JSONB NOT NULL,
        embedding vector(1024),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'general',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Indexes for fast vector similarity and foreign key lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_categories_embedding ON categories USING hnsw (embedding vector_cosine_ops);
      CREATE INDEX IF NOT EXISTS idx_data_store_embedding ON data_store USING hnsw (embedding vector_cosine_ops);
      CREATE INDEX IF NOT EXISTS idx_data_store_category_id ON data_store (category_id);
    `);

    console.log("Database tables created successfully");
  } finally {
    client.release();
  }
};
