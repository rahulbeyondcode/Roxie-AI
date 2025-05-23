import { tool } from "@langchain/core/tools";

import { CollectionNames } from '../models';

const getAllCollections = tool(
  async () => {
    console.log('🛠️  Get all collections');
    const allCollections = await CollectionNames.find();
    return JSON.stringify(allCollections);
  },
  {
    name: "getAllCollections",
    description:
      "Stores metadata about all defined collections, including their name and description. Helpful for listing available memory modules or debugging",
  }
);

export default getAllCollections;