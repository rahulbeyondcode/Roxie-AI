import * as mongoDBTools from "../db/mongodb/tools";
import * as qdrantTools from "../db/qdrant/tools";

import getCurrentDateTime from "./getCurrentDateTime";

const { createNewUser, findUsers, getAllCollections, updateExistingUser } =
  mongoDBTools;
const {} = qdrantTools;

export const tools = [
  getAllCollections,
  createNewUser,
  updateExistingUser,
  findUsers,
  getCurrentDateTime,
];
