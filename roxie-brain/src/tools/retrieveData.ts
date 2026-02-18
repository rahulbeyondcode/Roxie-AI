import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

import { sqlDB } from "../db/index";

const retrieveData = new DynamicStructuredTool({
  name: "retrieve_data",
  description:
    "Retrieve stored entries by category name or get the most recent entries. Use this when the user asks to see everything in a specific category (e.g., 'show me my grocery list') or wants to review recent memories.",
  schema: z.object({
    category: z
      .string()
      .optional()
      .describe(
        "Exact category name to filter by (e.g., 'groceries', 'money_owed_to_me'). If omitted, returns the most recent entries across all categories."
      ),
    limit: z
      .number()
      .optional()
      .default(10)
      .describe("Maximum number of results to return (default 10)."),
  }),
  func: async ({ category, limit = 10 }) => {
    console.log(`📜 Retrieve Data Tool called — category: ${category || "all"}, limit: ${limit}`)
    try {
      let rows;

      if (category) {
        console.log(`📜 Retrieve Data Querying by category "${category}"`)
        const result = await sqlDB.query(
          `SELECT ds.id, ds.data, ds.created_at, ds.updated_at,
                  c.name AS category
           FROM data_store ds
           JOIN categories c ON ds.category_id = c.id
           WHERE c.name = $1
           ORDER BY ds.created_at DESC
           LIMIT $2`,
          [category, limit]
        );
        rows = result.rows;
      } else {
        console.log(`📜 Retrieve Data Querying recent entries across all categories...`)
        const result = await sqlDB.query(
          `SELECT ds.id, ds.data, ds.created_at, ds.updated_at,
                  c.name AS category
           FROM data_store ds
           JOIN categories c ON ds.category_id = c.id
           ORDER BY ds.created_at DESC
           LIMIT $1`,
          [limit]
        );
        rows = result.rows;
      }

      console.log(`📜 Retrieve Data Retrieved ${rows.length} entries ✅`)

      return JSON.stringify({
        success: true,
        count: rows.length,
        results: rows.map((r) => ({
          id: r.id,
          data: r.data,
          category: r.category,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        })),
      });
    } catch (err) {
      console.log(`📜 Retrieve Data Error ❌`, (err as Error).message)
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      });
    }
  },
});

export default retrieveData;
