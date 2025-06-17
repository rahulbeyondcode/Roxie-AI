import { tool } from "@langchain/core/tools";

import { CollectionNames } from "../models";

const getAllCollections = tool(
  async () => {
    try {
      console.log("🛠️  Get all collections");
      const allCollections = await CollectionNames.find();
      return JSON.stringify(allCollections);
    } catch (err) {
      console.log("Something went wrong: ", err);
    }
  },
  {
    name: "getAllCollections",
    description:
      "Stores metadata about all defined collections, including their name and description. Helpful for listing available memory modules or debugging",
  }
);

export default getAllCollections;
