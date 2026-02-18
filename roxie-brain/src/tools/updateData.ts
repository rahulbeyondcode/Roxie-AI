import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

import { sqlDB } from "../db/index";
import fetchEmbeddings from "../helpers/get-embeddings";

const updateData = new DynamicStructuredTool({
  name: "update_data",
  description:
    "Update an existing entry in Roxie's memory. Use this when the user corrects or modifies previously stored information (e.g., 'actually it was 600, not 500'). First use search_data to find the entry ID, then call this tool.",
  schema: z.object({
    id: z.number().describe("The ID of the entry to update."),
    data: z
      .string()
      .describe(
        "A JSON string of fields to merge into the existing data. Existing fields not mentioned here are preserved. Example: '{\"amount\":600}'"
      ),
    content: z
      .string()
      .optional()
      .describe(
        "If the meaning of the entry has changed, provide an updated natural language summary to re-generate the embedding. Omit if only numeric/status fields changed."
      ),
  }),
  func: async ({ id, data, content }) => {
    console.log(`📝 Update Data Tool called — id: ${id}, re-embed: ${!!content}`)
    try {
      const parsed = JSON.parse(data);
      console.log(`📝 Update Data parsed update data:`, parsed)

      console.log(`📝 Update Data fetching existing entry #${id}`)
      const existing = await sqlDB.query(
        "SELECT id, data FROM data_store WHERE id = $1",
        [id]
      );

      if (existing.rows.length === 0) {
        console.log(`📝 Update Data entry #${id} not found ❌`)
        return JSON.stringify({
          success: false,
          error: `Entry with id ${id} not found`,
        });
      }
      console.log(`📝 Update Data found existing entry #${id}`)

      const mergedData = { ...existing.rows[0].data, ...parsed };

      if (content) {
        console.log(`📝 Update Data Content changed — generating new embedding`)
        const embedding = await fetchEmbeddings(content);
        if (!embedding) {
          console.log(`📝 Update Data embedding generation failed ❌`)
          return JSON.stringify({
            success: false,
            error: "Failed to generate embedding for updated content",
          });
        }
        console.log(`📝 Update Data embedding generated ${embedding.length} dimensions ✅`)

        console.log(`📝 Update Data updating entry with new data + embedding`)
        await sqlDB.query(
          `UPDATE data_store
           SET data = $1, embedding = $2, updated_at = NOW()
           WHERE id = $3`,
          [JSON.stringify(mergedData), JSON.stringify(embedding), id]
        );
      } else {
        console.log(`📝 Update Data updating data fields only (no re-embedding)`)
        await sqlDB.query(
          `UPDATE data_store
           SET data = $1, updated_at = NOW()
           WHERE id = $2`,
          [JSON.stringify(mergedData), id]
        );
      }

      console.log(`📝 Update Data entry #${id} updated successfully ✅`)

      return JSON.stringify({
        success: true,
        id,
        updatedData: mergedData,
      });
    } catch (err) {
      console.log(`📝 Update Data Error ❌`, (err as Error).message)
      return JSON.stringify({
        success: false,
        error: (err as Error).message,
      });
    }
  },
});

export default updateData;
