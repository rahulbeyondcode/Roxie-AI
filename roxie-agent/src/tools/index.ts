import { createNewUser } from "../db/mongodb/tools/create-new-user";
import { findUsers } from "../db/mongodb/tools/find-user";
import { getAllCollections } from "../db/mongodb/tools/get-all-collections";
import { updateExistingUser } from "../db/mongodb/tools/update-existing-user";

export const tools = [getAllCollections, createNewUser, updateExistingUser, findUsers];
