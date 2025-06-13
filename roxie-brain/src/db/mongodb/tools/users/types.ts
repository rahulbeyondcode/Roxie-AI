import mongoose from "mongoose";

export type UserType = {
  _id?: mongoose.Types.ObjectId;
  name: string;
  location?: string;
  relation: string;
  phone_number?: number;
  date_of_birth?: string;
  occupation?: string;
  is_favorite?: boolean;
  notes?: string;
  last_called?: string;
  last_met?: string;
  profile_photo_urls?: string;
};

// Now FindUserProps is derived from the core object
export type FindUserProps = Partial<
  Pick<
    UserType,
    | "name"
    | "location"
    | "relation"
    | "phone_number"
    | "date_of_birth"
    | "occupation"
    | "is_favorite"
  >
>;

export type CreateOrListToolInputType = Omit<UserType, "_id">;

export type EditUserToolInputType = {
  find_props: FindUserProps;
} & UserType;
