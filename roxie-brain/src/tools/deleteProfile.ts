import { DynamicStructuredTool } from "@langchain/core/tools"
import { z } from "zod"

import { sqlDB } from "../db/index"

const deleteProfile = new DynamicStructuredTool({
  name: "delete_profile",
  description:
    "Delete a stored fact from the user's profile. Use this when the user asks to remove a piece of personal information (e.g., 'forget my location', 'remove my job title').",
  schema: z.object({
    key: z
      .string()
      .describe(
        "The fact key to delete (e.g., 'location', 'job_title')."
      ),
  }),
  func: async ({ key }) => {
    console.log(`👤 Delete Profile Tool called — key: "${key}"`)
    try {
      console.log(`👤 Delete Profile Deleting key "${key}" from user_profile`)
      const { rows } = await sqlDB.query(
        "DELETE FROM user_profile WHERE key = $1 RETURNING id, key",
        [key]
      )

      if (rows.length === 0) {
        console.log(`👤 Delete Profile key "${key}" not found  ❌`)
        return JSON.stringify({
          success: false,
          error: `No profile fact found with key '${key}'.`,
        })
      }

      console.log(`👤 Delete Profile deleted key "${key} ✅"`)

      return JSON.stringify({
        success: true,
        deletedKey: rows[0].key,
      })
    } catch (err) {
      console.log(`👤 Delete Profile Error ❌`, (err as Error).message)
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      })
    }
  },
})

export default deleteProfile
