import getAllCollections from "./get-all-collections";

import createNewGrocery from "./groceries/add-grocery-item";
import updateExistingGrocery from "./groceries/edit-grocery-item";
import listGrocery from "./groceries/list-grocery";

import createNewUser from "./users/create-new-user";
import findUsers from "./users/find-user";
import updateExistingUser from "./users/update-existing-user";

const userTools = [createNewUser, findUsers, updateExistingUser];
const groceryTools = [listGrocery, createNewGrocery, updateExistingGrocery];

export { getAllCollections, groceryTools, userTools };
