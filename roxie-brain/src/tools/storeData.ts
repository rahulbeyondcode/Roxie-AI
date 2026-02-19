import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

import { sqlDB } from "../db/index";
import matchOrCreateCategory from "../helpers/category-helper";
import fetchEmbeddings from "../helpers/get-embeddings";

const storeData = new DynamicStructuredTool({
  name: "store_data",
  description:
    "Store a piece of information in Roxie's memory. Use this whenever the user tells you something worth remembering — facts, preferences, debts, tasks, events, lists, etc. Each call stores one distinct piece of information.",
  schema: z.object({
    content: z
      .string()
      .describe(
        "A natural language summary of what is being stored. This gets embedded for future semantic search."
      ),
    data: z
      .string()
      .describe(
        'A JSON string of structured data extracted from the user\'s message. Include relevant fields like items, people, amounts, dates, status, etc. Example: \'{"person":"Akshay","amount":500,"currency":"INR"}\''
      ),
    category: z
      .string()
      .describe(
        "Your best guess for the category name (lowercase, underscore_separated). Will be matched against existing categories or used to create a new one."
      ),
  }),
  func: async ({ content, data, category }) => {
    console.log(`💾 Store Data Tool called — category: "${category}"`);
    try {
      const parsed = JSON.parse(data);
      console.log(`💾 Store Data Parsed data:`, parsed);

      console.log(`💾 Store Data matching/creating category "${category}"`);
      const matched = await matchOrCreateCategory(content, category);
      console.log(
        `💾 Store Data category resolved: "${matched.name}" (id: ${matched.id}, new: ${matched.isNew})`
      );

      console.log(`💾 Store Data generating embedding`);
      const embedding = await fetchEmbeddings(content);
      if (!embedding) {
        console.log(`💾 Store Data embedding generation failed ❌`);
        return JSON.stringify({
          success: false,
          error: "Failed to generate embedding for content",
        });
      }
      console.log(
        `💾 Store Data embedding generated ${embedding.length} dimensions ✅`
      );

      console.log(`💾 Store Data inserting into data_store`);
      const { rows } = await sqlDB.query(
        `INSERT INTO data_store (category_id, data, embedding)
         VALUES ($1, $2, $3)
         RETURNING id, created_at`,
        [matched.id, JSON.stringify(parsed), JSON.stringify(embedding)]
      );

      console.log(
        `💾 Store Data stored successfully — id: ${rows[0].id}, category: "${matched.name}" ✅`
      );

      return JSON.stringify({
        success: true,
        id: rows[0].id,
        category: matched.name,
        categoryIsNew: matched.isNew,
        createdAt: rows[0].created_at,
      });
    } catch (err) {
      console.log(`💾 Store Data Error ❌`, (err as Error).message);
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      });
    }
  },
});

export default storeData;
