import { tool } from "@langchain/core/tools";
import { z } from "zod";

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

export const updateExistingUser = tool(
  async (input: PropType) => {
    console.log('🛠️Update existing user: ', input);
    // const user = await User.create(input);
    // return user
  },
  {
    name: "updateExistingUser",
    description:
      "Use this tool to **update the existing information** of a known person in the user database. This includes modifying their phone number, name, location, last contacted dates, or adding new notes. Only use this if the person is already present in the database. Do not use this tool for creating new profiles.",
    schema: z.object({
      find_props: z.object({
        name: z
          .string()
          .optional()
          .describe("Full name of the person you want to search and find."),
        location: z
          .string()
          .optional()
          .describe("The city or general location to search in db to filter user."),
        relation: z
          .string()
          .optional()
          .describe("The type of relationship you have with the person to be searched"),
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
      }).describe('A set of identifying properties used to locate an existing user in the database before updating their information. These fields act as filters to match the correct user. You should fill in as many of these as you confidently know, especially name, relation, or phone_number, to increase the chance of finding the right person. At least one field must be provided.'),

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
        .string()
        .optional()
        .describe("The person's date of birth, useful for age calculation or birthday reminders. Always store in DD/MM/YYYY format"),
      occupation: z
        .string()
        .optional()
        .describe("The person's current job or profession."),
      last_called: z
        .string()
        .optional()
        .describe("The last time you called or spoke to this person, used for engagement tracking. Always store in DD/MM/YYYY hh:mm:ss A format")
        .optional(),
      last_met: z
        .string()
        .optional()
        .describe("The most recent in-person meeting date with this person. Always store in DD/MM/YYYY hh:mm:ss A format"),
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
