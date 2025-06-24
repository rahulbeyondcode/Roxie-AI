import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Grocery } from "../../models";
import { FindGroceryPropsType } from "./types";

const deleteGrocery = tool(
  async (input: FindGroceryPropsType) => {
    console.log("🗑️ Delete Grocery Item(s):", input);

    const query: any = {};

    if (input.name) {
      query.name = { $regex: input.name.toLowerCase(), $options: "i" };
    }
    if (input.category) {
      query.category = input.category;
    }
    if (typeof input.is_urgent === "boolean") {
      query.is_urgent = input.is_urgent;
    }
    if (input.added_on) {
      query.added_on = input.added_on;
    }
    if (input.reminder_time) {
      query.reminder_time = input.reminder_time;
    }

    try {
      console.log("query: ", query);
      const result = await Grocery.deleteMany(query);
      console.log("result: ", result);
      console.log("---------------------------------------");
      console.log("");
      if (result.deletedCount === 0) {
        return "No grocery items matched the filters. Nothing was deleted.";
      }

      return `Successfully deleted ${result.deletedCount} grocery item(s).`;
    } catch (err) {
      console.error("Error deleting groceries:", err);
      return "Something went wrong while deleting grocery items.";
    }
  },
  {
    name: "deleteGrocery",
    description:
      "Use this tool to delete grocery items from the list. You can filter by name, category, urgency, added date, or reminder time. Be specific to avoid deleting unintended items. You must always ask confirmation before using this tool to delete",
    schema: z.object({
      name: z.string().optional().describe("Name of the grocery item."),
      category: z
        .enum([
          "bakery",
          "beverages",
          "cleaning",
          "dairy",
          "dressing",
          "fruits",
          "grains",
          "meat",
          "others",
          "personal_care",
          "spices",
          "vegetables",
        ])
        .optional()
        .describe("Category of the grocery item."),
      is_urgent: z
        .boolean()
        .optional()
        .describe("Whether the item is marked as urgent."),
      added_on: z
        .string()
        .optional()
        .describe("Exact date/time added in format DD/MM/YYYY hh:mm:ss A."),
      reminder_time: z
        .string()
        .optional()
        .describe("Exact reminder date/time in format DD/MM/YYYY hh:mm:ss A."),
    }),
  }
);

export default deleteGrocery;
