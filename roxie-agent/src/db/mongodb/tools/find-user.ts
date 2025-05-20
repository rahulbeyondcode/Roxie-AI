import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { User } from "../models";

type PropType = {
  name: string;
  location?: string;
  relation: string;
  notes?: string;
  phone_number?: number;
  date_of_birth?: string;
  occupation?: string;
  last_called?: string;
  last_met?: string;
  is_favorite?: boolean;
  profile_photo_urls?: string;
}

export const findUsers = tool(
  async (input: PropType) => {
    console.log('🛠️  Find Users: ', input);
    let usersList = [];

    if (input?.name) {
      const user = await User.find({ name: { $regex: input?.name?.toLowerCase(), $options: "i" } })
      usersList?.push(user)
    } else if (input?.location) {
      const user = await User.find({ location: { $regex: input?.location?.toLowerCase(), $options: "i" } })
      usersList?.push(user)
    } else if (input?.relation) {
      const user = await User.find({ relation: { $regex: input?.relation?.toLowerCase(), $options: "i" } })
      usersList?.push(user)
    } else if (input?.phone_number) {
      const user = await User.find({ phone_number: input?.phone_number })
      usersList?.push(user)
    } else if (input?.date_of_birth) {
      const user = await User.find({ date_of_birth: { $regex: input?.date_of_birth?.toLowerCase(), $options: "i" } })
      usersList?.push(user)
    } else if (input?.occupation) {
      const user = await User.find({ occupation: { $regex: input?.occupation?.toLowerCase(), $options: "i" } })
      usersList?.push(

      )
    } else if (input?.is_favorite) {
      const user = await User.find({ is_favorite: input?.is_favorite })
      usersList?.push(user)
    }

    console.log('usersList: ', usersList);
    // const user = await User.create(input);
    return JSON.stringify(usersList)
  },
  {
    name: "findUser",
    description:
      "Use this tool to search for a specific person in the user database using known attributes such as their name, relation, location, phone number, date of birth, or occupation. This is useful when you need to verify if a person already exists before performing any update or to fetch their details for contextual purposes.",
    schema: z.object({
      name: z
        .string()
        .optional()
        .describe("Full name of the person you want to search in db."),
      location: z
        .string()
        .optional()
        .describe("The city or general location to search in db."),
      relation: z
        .string()
        .optional()
        .describe("The type of relationship with the person to be searched"),
      phone_number: z
        .string()
        .optional()
        .describe("Contact number to be searched in db."),
      date_of_birth: z
        .string()
        .optional()
        .describe("The person's date of birth in DD/MM/YYYY format for searching"),
      occupation: z
        .string()
        .optional()
        .describe("The person's current job or profession."),
      is_favorite: z
        .string()
        .optional()
        .describe("Boolean flag indicating whether this person is marked as a favorite (true or false)."),
    }),
  }
);
