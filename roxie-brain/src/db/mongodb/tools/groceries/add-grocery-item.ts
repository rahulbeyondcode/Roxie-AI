import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Grocery } from "../../models";
import { CreateOrListToolInputType } from "./types";

const createNewGrocery = tool(
  async (input: CreateOrListToolInputType) => {
    console.log("🛠️  Create new Grocery Item: ", input);
    try {
      const grocery = await Grocery.create(input);
      console.log("grocery: ", grocery);
      return grocery;
    } catch (err) {
      console.log("Something went wrong: ", err);
    }
  },
  {
    name: "addNewGroceryItem",
    description:
      "Use this tool to add a new grocery item to the list or database. It's for items the user needs soon or regularly buys. You must have the item's name, category and any other available fields like quantity, urgency, or reminder time. You must always auto infer categories if not explicitly specified by the user and must seek confirmation from user. If any field is missing, you must ask the user first. Always summarise and confirm with the user before calling this tool. Never call this tool before summarising and getting exlicit permission from user to add the item",

    schema: z.object({
      name: z
        .string()
        .describe("Name of the grocery item (example: eggs, milk, rice)"),
      quantity: z
        .string()
        .optional()
        .describe(
          "How much of the item is needed (example: 1kg, 2 packs, 3 bottles etc)"
        ),
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
        .describe("The general category the item belongs to"),
      is_urgent: z
        .boolean()
        .optional()
        .describe(
          "Boolean flag (true or false) to mark if the item is urgently needed. Ask explicitly if it is urgent or not if not mentioned"
        ),
      notes: z
        .string()
        .optional()
        .describe("Any extra info like preferred brand, offer alerts, etc."),
      added_on: z
        .string()
        .optional()
        .describe(
          "Date when this item was added. Format: DD/MM/YYYY hh:mm:ss A. Autofill with current date and time without asking the user. Use necessary tools to get the current date and time"
        ),
      reminder_time: z
        .string()
        .optional()
        .describe(
          "Optional time to remind the user to buy the item, in DD/MM/YYYY hh:mm:ss A"
        ),
    }),
  }
);

export default createNewGrocery;
