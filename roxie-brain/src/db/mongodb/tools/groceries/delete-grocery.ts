import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Grocery } from "../../models";
import { FindGroceryPropsType } from "./types";

const listGrocery = tool(
  async (input: FindGroceryPropsType) => {
    console.log("☠️ Delete Grocery Item:", input);

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
      const groceries = await Grocery.find(query);

      console.log("List groceries: ", groceries);

      if (!groceries?.length) {
        return "No grocery items matched your search.";
      }

      return `Found ${groceries?.length} item(s): ${JSON.stringify(groceries, null, 2)}`;
    } catch (err) {
      console.log("Something went wrong: ", err);
    }
  },
  {
    name: "listGrocery",
    description:
      "Use this tool to find grocery items in the list. You can filter by name, category, urgency, added date, reminder time, or use it without filters to list all groceries.",
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

export default listGrocery;
