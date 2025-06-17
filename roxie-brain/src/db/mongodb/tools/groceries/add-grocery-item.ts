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
      "Use this tool to add a **new grocery item** to the grocery list or database. The item can be something you need to buy soon or something you regularly stock. You can specify the item name, quantity, category (example: vegetables, dairy etc), urgency, and an optional reminder time to make the list smarter and more useful. Use it whenever a user says they need to buy or remember an item. Remember before inputting the tool, ask for fields that are missing or you don't have. **Always summarise and ask the user before using this tool**",

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
