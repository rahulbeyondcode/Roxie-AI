import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

import { sqlDB } from "../db/index";
import fetchEmbeddings from "../helpers/get-embeddings";

const searchData = new DynamicStructuredTool({
  name: "search_data",
  description:
    "Search Roxie's memory using semantic similarity. Use this when the user asks a question and you need to find relevant stored information. Returns the closest matching entries ranked by similarity.",
  schema: z.object({
    query: z
      .string()
      .describe("Natural language search query describing what to look for."),
    limit: z
      .number()
      .optional()
      .default(5)
      .describe("Maximum number of results to return (default 5)."),
  }),
  func: async ({ query, limit = 5 }) => {
    console.log(`🔍 Search Data Tool called — query: "${query}", limit: ${limit}`)
    try {
      console.log(`🔍 Search Data generating embedding for query`)
      const embedding = await fetchEmbeddings(query);
      if (!embedding) {
        console.log(`🔍 Search Data embedding generation failed ❌`)
        return JSON.stringify({
          success: false,
          error: "Failed to generate embedding for query",
        });
      }
      console.log(`🔍 Search Data embedding generated ${embedding.length} dimensions ✅`)

      console.log(`🔍 Search Data Running similarity search`)
      const { rows } = await sqlDB.query(
        `SELECT ds.id, ds.data, ds.created_at, ds.updated_at,
                c.name AS category,
                1 - (ds.embedding <=> $1) AS similarity
         FROM data_store ds
         JOIN categories c ON ds.category_id = c.id
         ORDER BY ds.embedding <=> $1 ASC
         LIMIT $2`,
        [JSON.stringify(embedding), limit]
      );

      console.log(`🔍 Search Data found ${rows.length} results ✅`)

      return JSON.stringify({
        success: true,
        count: rows.length,
        results: rows.map((r) => ({
          id: r.id,
          data: r.data,
          category: r.category,
          similarity: parseFloat(parseFloat(r.similarity).toFixed(4)),
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        })),
      });
    } catch (err) {
      console.log(`🔍 Search Data Error ❌`, (err as Error).message)
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      });
    }
  },
});

export default searchData;
