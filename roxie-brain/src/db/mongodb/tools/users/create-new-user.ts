import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { User } from "../../models";
import { CreateOrListToolInputType } from "./types";

const createNewUser = tool(
  async (input: CreateOrListToolInputType) => {
    console.log("🛠️  Create new User: ", input);
    const user = await User.create(input);
    return user;
  },
  {
    name: "createNewUser",
    description:
      "Use this tool when adding a **brand new person** to the user database who doesn't already exist. It stores key information like their name, location, relation (e.g., friend, colleague), birthday, phone number, notes, and photo links. Only use this if you're sure this person hasn't been added before. Avoid duplicates by not using this tool for updates. Make sure to ask follow up questions till you fill up all optional fields as well",
    schema: z.object({
      name: z
        .string()
        .describe(
          "Full name of the person you want to remember or interact with."
        ),
      location: z
        .string()
        .optional()
        .describe(
          "The city or general location where the person lives or is currently based."
        ),
      relation: z
        .enum([
          "father",
          "mother",
          "sister",
          "wife",
          "uncle",
          "aunt",
          "cousin",
          "grandfather",
          "father-in-law",
          "mother-in-law",
          "brother-in-law",
          "sister-in-law",
          "friend",
          "bestfriend",
          "colleague",
          "classmate",
          "neighbor",
          "mentor",
          "teacher",
        ])
        .describe(
          "The type of relationship you have with this person (e.g., friend, brother, colleague etc)."
        ),
      notes: z
        .string()
        .optional()
        .describe(
          "Any extra notes or personal information about the person, such as preferences or memories."
        ),
      phone_number: z
        .string()
        .optional()
        .describe("The person's contact number for calling or messaging."),
      date_of_birth: z
        .string()
        .optional()
        .describe(
          "The person's date of birth, useful for age calculation or birthday reminders. Always store in DD/MM/YYYY format"
        ),
      occupation: z
        .string()
        .optional()
        .describe("The person's current job or profession."),
      last_called: z
        .string()
        .optional()
        .describe(
          "The last time you called or spoke to this person, used for engagement tracking. Always store in DD/MM/YYYY hh:mm:ss A format"
        )
        .optional(),
      last_met: z
        .string()
        .optional()
        .describe(
          "The most recent in-person meeting date with this person. Always store in DD/MM/YYYY hh:mm:ss A format"
        ),
      is_favorite: z
        .string()
        .optional()
        .describe(
          "Boolean flag indicating whether this person is marked as a favorite (true or false)."
        ),
      profile_photo_urls: z
        .string()
        .optional()
        .describe(
          "URL pointing to the person's profile picture or stored image."
        ),
    }),
  }
);

export default createNewUser;
