import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Grocery } from "../../models";
import { EditGroceryToolInputType, GroceryType } from "./types";

const updateExistingGrocery = tool(
  async (payload: EditGroceryToolInputType) => {
    console.log("🛠️  Update existing Grocery: ", payload);

    const input = payload.find_props;
    let groceriesList: GroceryType[] = [];

    const query = {} as any;

    if (input?.name) {
      query.name = { $regex: input.name.toLowerCase(), $options: "i" };
    }
    if (input?.category) {
      query.category = { $regex: input.category.toLowerCase(), $options: "i" };
    }
    if (typeof input?.is_urgent === "boolean") {
      query.is_urgent = input.is_urgent;
    }

    const grocery = await Grocery.find(query);
    groceriesList = grocery as GroceryType[];

    console.log("Edit groceriesList: ", groceriesList);

    if (groceriesList?.length === 0) {
      return "No grocery item matched.";
    }
    if (groceriesList?.length === 1) {
      const groceryId = groceriesList?.[0]?._id;
      const updatedPayload = { ...payload } as any;
      delete updatedPayload.find_props;

      const updatedGrocery = await Grocery.findByIdAndUpdate(
        groceryId,
        updatedPayload,
        {
          new: true,
        }
      );

      return `Done. Updated Grocery fetched from DB: ${JSON.stringify(updatedGrocery)}`;
    }
    if (groceriesList?.length > 1) {
      return `Multiple Grocery items found. Help to identify. Groceries: ${JSON.stringify(groceriesList)}`;
    }
  },
  {
    name: "updateExistingGrocery",
    description:
      "Use this tool to **update an existing grocery item** from the list. You can change its quantity, category, urgency, or any other field. Make sure you search the item using filters like name or category first (inside find_props). Do NOT use this to create a new item.",
    schema: z.object({
      find_props: z
        .object({
          name: z
            .string()
            .optional()
            .describe("Name of the grocery item to search and edit."),
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
            .describe("Whether the item is marked as urgent (true/false)."),
        })
        .describe(
          "Use any of these fields to filter and find the grocery item you want to edit. At least one must be provided."
        ),

      name: z.string().optional().describe("Updated name of the item."),
      quantity: z
        .string()
        .optional()
        .describe("Updated quantity like '2kg', '3 bottles'."),
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
        .describe("Updated grocery category."),
      is_urgent: z
        .string()
        .optional()
        .describe("Update urgency flag (true/false)."),
      notes: z
        .string()
        .optional()
        .describe("Extra info to update about the item."),
      added_on: z
        .string()
        .optional()
        .describe("Date this was added (DD/MM/YYYY hh:mm:ss A)."),
    }),
  }
);

export default updateExistingGrocery;
