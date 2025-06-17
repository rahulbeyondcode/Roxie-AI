import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { User } from "../../models";
import { CreateOrListToolInputType } from "./types";

const findUsers = tool(
  async (input: CreateOrListToolInputType) => {
    console.log("🛠️  Find Users: ", input);
    let usersList = [];

    if (input?.name) {
      try {
        const user = await User.find({
          name: { $regex: input?.name?.toLowerCase(), $options: "i" },
        });
        usersList?.push(user);
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.location) {
      try {
        const user = await User.find({
          location: { $regex: input?.location?.toLowerCase(), $options: "i" },
        });
        usersList?.push(user);
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.relation) {
      try {
        const user = await User.find({
          relation: { $regex: input?.relation?.toLowerCase(), $options: "i" },
        });
        usersList?.push(user);
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.phone_number) {
      try {
        const user = await User.find({ phone_number: input?.phone_number });
        usersList?.push(user);
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
        usersList?.push(user);
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
        usersList?.push(user);
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    } else if (input?.is_favorite) {
      try {
        const user = await User.find({ is_favorite: input?.is_favorite });
        usersList?.push(user);
      } catch (err) {
        console.log("Something went wrong: ", err);
      }
    }

    console.log("usersList: ", usersList);
    return JSON.stringify(usersList);
  },
  {
    name: "findUser",
    description:
      "Call this tool to search for people using **any available info** — even just the relation (e.g., 'wife', 'best friend'). It's safe to call without a name. If multiple matches are found, show them and let the user choose. If no match is found, ask for other fields like name, occupation, location, or phone number. **Don't wait for the name — use what you have.** Don't overwhelm the user with constant questioning",
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
        .describe("The type of relationship with the person to be searched"),
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
    }),
  }
);

export default findUsers;
