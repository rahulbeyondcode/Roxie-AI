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
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        embedding vector(1024),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Indexes for fast vector similarity and foreign key lookups
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_categories_embedding ON categories USING hnsw (embedding vector_cosine_ops);
      CREATE INDEX IF NOT EXISTS idx_data_store_embedding ON data_store USING hnsw (embedding vector_cosine_ops);
      CREATE INDEX IF NOT EXISTS idx_data_store_category_id ON data_store (category_id);
      CREATE INDEX IF NOT EXISTS idx_messages_embedding ON messages USING hnsw (embedding vector_cosine_ops);
    `);

    console.log("Database tables created successfully");
  } finally {
    client.release();
  }
};
