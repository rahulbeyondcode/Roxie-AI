import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

import { sqlDB } from "../db/index";

const deleteData = new DynamicStructuredTool({
  name: "delete_data",
  description:
    "Delete an entry from Roxie's memory. Use this when the user asks to remove something (e.g., 'forget the debt from Akshay'). First use search_data to find the entry ID, then call this tool.",
  schema: z.object({
    id: z.number().describe("The ID of the entry to delete."),
  }),
  func: async ({ id }) => {
    console.log(`🗑️ Delete Data Tool called — id: ${id}`)
    try {
      console.log(`🗑️ Delete Data Tool deleting entry #${id}...`)
      const { rows } = await sqlDB.query(
        "DELETE FROM data_store WHERE id = $1 RETURNING id",
        [id]
      );

      if (rows.length === 0) {
        console.log(`🗑️ Delete Data Tool entry #${id} not found  ❌`)
        return JSON.stringify({
          success: false,
          error: `Entry with id ${id} not found`,
        });
      }

      console.log(`🗑️ Delete Data Tool entry #${id} deleted successfully ✅`)

      return JSON.stringify({
        success: true,
        deletedId: rows[0].id,
      });
    } catch (err) {
      console.log(`🗑️ Delete Data Tool Error ❌`, (err as Error).message)
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      });
    }
  },
});

export default deleteData;
