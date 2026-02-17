import { Pool } from "pg";

import fetchEmbeddings from "../helpers/get-embeddings";

const DEFAULT_CATEGORIES = [
  "groceries",
  "shopping_clothes",
  "shopping_electronics",
  "shopping_other",
  "tasks",
  "work_tasks",
  "borrowed_items",
  "money_owed_to_me",
  "money_i_owe",
  "health_tracking",
  "calendar_events",
  "personal_notes",
  "books_media",
  "contacts",
];

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const seedCategories = async (pool: Pool) => {
  const { rows } = await pool.query("SELECT COUNT(*) FROM categories");
  const count = parseInt(rows[0].count, 10);

  if (count > 0) {
    console.log(
      `Categories already seeded (${count} found), skipping seed`
    );
    return;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      for (const name of DEFAULT_CATEGORIES) {
        const embedding = await fetchEmbeddings(name);
        if (!embedding) {
          throw new Error(`Failed to get embedding for "${name}"`);
        }

        await pool.query(
          "INSERT INTO categories (name, embedding) VALUES ($1, $2)",
          [name, JSON.stringify(embedding)]
        );
      }

      console.log(
        `Seeded ${DEFAULT_CATEGORIES.length} default categories with embeddings`
      );
      return;
    } catch (err) {
      console.warn(
        `Seed attempt ${attempt}/${MAX_RETRIES} failed:`,
        (err as Error).message
      );

      // Clean up any partial inserts from this attempt
      await pool.query("DELETE FROM categories");

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  console.warn(
    "Embedder unavailable after all retries, skipping category seed — restart to retry"
  );
};
