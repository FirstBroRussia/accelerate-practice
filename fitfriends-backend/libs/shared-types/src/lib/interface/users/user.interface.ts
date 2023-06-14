import { LocationMetroType, UserRoleType } from "@fitfriends-backend/shared-types";


export interface UserInterface {
  name?: string;

  email?: string;

  avatar?: string;

  password?: string;

  gender?: string;

  role?: UserRoleType;

  description?: string;

  location?: LocationMetroType;

  imageForSite?: string;

  createdAt?: string;
}
