import { tool } from "@langchain/core/tools";

import { CollectionNames } from '../db/mongodb/models';

export const getAllCollections = tool(
  async () => {
    console.log("*-*-*-*-*-*- Tools *-*-*-*-*-*-\nList all collections");
    const allCollections = CollectionNames.find({});
    return allCollections;
  },
  {
    name: "getAllCollections",
    description:
      "Stores metadata about all defined collections, including their name and description. Helpful for listing available memory modules or debugging",
  }
);
