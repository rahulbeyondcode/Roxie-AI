import { sqlDB } from "../db/index";
import { SIMILARITY_THRESHOLD } from "./config";
import fetchEmbeddings from "./get-embeddings";
import { sanitizeString } from "./utils";

interface CategoryMatch {
  id: number;
  name: string;
  isNew: boolean;
}

const matchOrCreateCategory = async (
  contentText: string,
  fallbackCategoryName: string
): Promise<CategoryMatch> => {
  const contentEmbedding = await fetchEmbeddings(contentText);
  if (!contentEmbedding) {
    throw new Error("Failed to generate embedding for content");
  }

  // Find closest existing category by cosine distance
  const { rows } = await sqlDB.query(
    `SELECT id, name, embedding <=> $1 AS distance
     FROM categories
     ORDER BY distance ASC
     LIMIT 1`,
    [JSON.stringify(contentEmbedding)]
  );

  if (rows.length > 0 && parseFloat(rows[0].distance) <= SIMILARITY_THRESHOLD) {
    // Match found — increment usage count
    await sqlDB.query(
      "UPDATE categories SET usage_count = usage_count + 1 WHERE id = $1",
      [rows[0].id]
    );
    return { id: rows[0].id, name: rows[0].name, isNew: false };
  }

  // No match — create new category using the fallback name
  const sanitized = sanitizeString(fallbackCategoryName);
  const nameEmbedding = await fetchEmbeddings(sanitized);
  if (!nameEmbedding) {
    throw new Error("Failed to generate embedding for new category name");
  }

  const insertResult = await sqlDB.query(
    `INSERT INTO categories (name, embedding, usage_count)
     VALUES ($1, $2, 1)
     ON CONFLICT (name) DO UPDATE SET usage_count = categories.usage_count + 1
     RETURNING id, name`,
    [sanitized, JSON.stringify(nameEmbedding)]
  );

  const row = insertResult.rows[0];
  // If ON CONFLICT fired, it's not truly new
  const isNew = insertResult.command === "INSERT";

  return { id: row.id, name: row.name, isNew };
};

export const loadCategoryNames = async (): Promise<string[]> => {
  const { rows } = await sqlDB.query<{ name: string }>(
    "SELECT name FROM categories ORDER BY usage_count DESC, name ASC"
  )
  return rows.map((r) => r.name)
}

export default matchOrCreateCategory;
