import * as mongoDBTools from "../db/mongodb/tools";
import * as qdrantTools from "../db/qdrant/tools";

import getCurrentDateTime from "./getCurrentDateTime";

const { userTools, groceryTools } = mongoDBTools;
const {} = qdrantTools;

export const tools = [getCurrentDateTime, ...userTools, ...groceryTools];
