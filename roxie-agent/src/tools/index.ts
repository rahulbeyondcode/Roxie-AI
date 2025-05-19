import { createNewUser } from "../db/mongodb/tools/create-new-user";
import { getAllCollections } from "../db/mongodb/tools/get-all-collections";

export const tools = [getAllCollections, createNewUser];
