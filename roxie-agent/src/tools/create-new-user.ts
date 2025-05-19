import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { User } from "../db/mongodb/models";

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

export const createNewUser = tool(
  async (input: PropType) => {
    console.log('input: ', input);
    const user = await User.create(input);
    return user
  },
  {
    name: "createNewUser",
    description:
      "This tool can store details about people the user cares about or interacts with, including name, relationship, location, contact info, and notes. Can be used for social memory and personalized responses.",
    schema: z.object({
      name: z
        .string()
        .describe("Full name of the person you want to remember or interact with."),
      location: z
        .string()
        .optional()
        .describe("The city or general location where the person lives or is currently based."),
      relation: z
        .string()
        .describe("The type of relationship you have with this person (e.g., friend, brother, colleague etc)."),
      notes: z
        .string()
        .optional()
        .describe("Any extra notes or personal information about the person, such as preferences or memories."),
      phone_number: z
        .string()
        .optional()
        .describe("The person's contact number for calling or messaging."),
      date_of_birth: z
        .date()
        .optional()
        .describe("The person's date of birth, useful for age calculation or birthday reminders."),
      occupation: z
        .string()
        .optional()
        .describe("The person's current job or profession."),
      last_called: z
        .date()
        .optional()
        .describe("The last time you called or spoke to this person, used for engagement tracking.")
        .optional(),
      last_met: z
        .string()
        .optional()
        .describe("The most recent in-person meeting date with this person."),
      is_favorite: z
        .string()
        .optional()
        .describe("Boolean flag indicating whether this person is marked as a favorite (true or false)."),
      profile_photo_urls: z
        .string()
        .optional()
        .describe("URL pointing to the person's profile picture or stored image."),
    }),
  }
);
