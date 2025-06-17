import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { User } from "../../models";
import { EditUserToolInputType, UserType } from "./types";

const updateExistingUser = tool(
  async (payload: EditUserToolInputType) => {
    console.log("🛠️  Update existing user: ", payload);

    const input = payload.find_props;
    let usersList = [] as UserType[];

    if (input?.name) {
      try {
        const user = await User.find({
          name: { $regex: input?.name?.toLowerCase(), $options: "i" },
        });
        usersList = user as UserType[];
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.location) {
      try {
        const user = await User.find({
          location: { $regex: input?.location?.toLowerCase(), $options: "i" },
        });
        usersList = user as UserType[];
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.relation) {
      try {
        const user = await User.find({
          relation: { $regex: input?.relation?.toLowerCase(), $options: "i" },
        });
        usersList = user as UserType[];
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.phone_number) {
      try {
        const user = await User.find({ phone_number: input?.phone_number });
        usersList = user as UserType[];
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.date_of_birth) {
      try {
        const user = await User.find({
          date_of_birth: {
            $regex: input?.date_of_birth?.toLowerCase(),
            $options: "i",
          },
        });
        usersList = user as UserType[];
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.occupation) {
      try {
        const user = await User.find({
          occupation: {
            $regex: input?.occupation?.toLowerCase(),
            $options: "i",
          },
        });
        usersList = user as UserType[];
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.is_favorite) {
      try {
        const user = await User.find({ is_favorite: input?.is_favorite });
        usersList = user as UserType[];
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    }

    if (usersList.length === 0) {
      return "No users found";
    }
    if (usersList.length === 1) {
      const userId = usersList?.[0]?._id;
      const updatedPayload = { ...payload } as any;
      delete updatedPayload.find_props;

      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          updatedPayload,
          {
            new: true,
          }
        );

        return `Done. Updated user fetched from DB: ${JSON.stringify(updatedUser)}`;
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    }
    if (usersList.length > 1) {
      return `Multiple users found. Help to identify. Users: ${JSON.stringify(usersList)}`;
    }
  },
  {
    name: "updateExistingUser",
    description:
      "Use this tool to **update the existing information** of a known person in the user database. This includes modifying their phone number, name, location, last contacted dates, or adding new notes. Only use this if the person is already present in the database. Do not use this tool for creating new profiles.",
    schema: z.object({
      find_props: z
        .object({
          name: z
            .string()
            .optional()
            .describe("Full name of the person you want to search and find."),
          location: z
            .string()
            .optional()
            .describe(
              "The city or general location to search in db to filter user."
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
            .optional()
            .describe(
              "The type of relationship you have with the person to be searched"
            ),
          phone_number: z
            .string()
            .optional()
            .describe("Contact number to be searched in db."),
          date_of_birth: z
            .string()
            .optional()
            .describe(
              "The person's date of birth in DD/MM/YYYY format for searching"
            ),
          occupation: z
            .string()
            .optional()
            .describe("The person's current job or profession."),
          is_favorite: z
            .string()
            .optional()
            .describe(
              "Boolean flag indicating whether this person is marked as a favorite (true or false)."
            ),
        })
        .describe(
          "A set of identifying properties used to locate an existing user in the database before updating their information. These fields act as filters to match the correct user. You should fill in as many of these as you confidently know, especially name, relation, or phone_number, to increase the chance of finding the right person. At least one field must be provided."
        ),

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

export default updateExistingUser;
