import { BackgroundImageForUsercardType, GenderType, LocationMetroType, UserRoleType } from "@fitfriends-backend-nx-monorepo/shared-types";


export interface UserInterface {
  name?: string;

  email?: string;

  avatar?: string;

  password?: string;

  gender?: GenderType;

  dateOfBirth?: string;

  role?: UserRoleType;

  description?: string;

  location?: LocationMetroType;

  imageForSite?: BackgroundImageForUsercardType;

  createdAt?: string;
}
