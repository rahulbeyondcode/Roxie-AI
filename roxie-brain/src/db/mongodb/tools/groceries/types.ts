import mongoose from "mongoose";

export type GroceryType = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  quantity: string;
  is_urgent: boolean;
  notes?: string;
  added_on?: string;
  reminder_time?: string;
  category:
    | "bakery"
    | "beverages"
    | "cleaning"
    | "dairy"
    | "dressing"
    | "fruits"
    | "grains"
    | "meat"
    | "others"
    | "personal_care"
    | "spices"
    | "vegetables";
};

export type FindGroceryPropsType = Partial<
  Omit<GroceryType, "quantity" | "notes">
>;

export type CreateOrListToolInputType = Omit<GroceryType, "_id">;

export type EditGroceryToolInputType = {
  find_props: FindGroceryPropsType;
} & GroceryType;
