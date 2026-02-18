import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

import { sqlDB } from "../db/index"

const listProfile = new DynamicStructuredTool({
  name: "list_profile",
  description:
    "List all stored facts from the user's profile. Use this when the user asks what you know about them (e.g., 'what do you know about me?', 'show my profile').",
  schema: z.object({}),
  func: async () => {
    console.log(`📋 List Profile Tool called`)
    try {
      console.log(`📋 List Profile getting all profile data`)
      const { rows } = await sqlDB.query(
        "SELECT key, value, category FROM user_profile ORDER BY category, key"
      )

      console.log(`📋 List Profile Found ${rows.length} facts ✅`)

      return JSON.stringify({
        success: true,
        facts: rows,
      })
    } catch (err) {
      console.log(`📋 List Profile Error ❌`, (err as Error).message)
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      })
    }
  },
})

export default listProfile
