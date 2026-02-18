import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

import { sqlDB } from "../db/index"

const setProfile = new DynamicStructuredTool({
  name: "set_profile",
  description:
    "Store or update a persistent fact about the user (name, location, preferences, relationships, allergies, work details, etc.). Use this whenever the user shares identity-level information that should always be known.",
  schema: z.object({
    key: z
      .string()
      .describe(
        "The fact key (e.g., 'name', 'location', 'favorite_cuisine', 'job_title')."
      ),
    value: z
      .string()
      .describe("The fact value (e.g., 'Rahul', 'India', 'Italian')."),
    category: z
      .string()
      .default("general")
      .describe(
        "Category grouping for the fact (identity, work, preferences, health, relationships, general). Defaults to 'general'."
      ),
  }),
  func: async ({ key, value, category }) => {
    console.log(`👤 [setProfile] Tool called — key: "${key}", value: "${value}", category: "${category}"`)
    try {
      console.log(`👤 [setProfile] Upserting into user_profile...`)
      const { rows } = await sqlDB.query(
        `INSERT INTO user_profile (key, value, category)
         VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE SET value = $2, category = $3, updated_at = NOW()
         RETURNING id, key, value, category`,
        [key, value, category]
      )

      console.log(`👤 [setProfile] ✅ Saved: ${key} = "${value}" (category: ${category})`)

      return JSON.stringify({
        success: true,
        fact: rows[0],
      })
    } catch (err) {
      console.log(`👤 [setProfile] ❌ Error:`, (err as Error).message)
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      })
    }
  },
})

export default setProfile
