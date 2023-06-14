import { UserRoleEnum } from "@fitfriends-backend/shared-types";


export type UserRoleType = typeof UserRoleEnum[keyof typeof UserRoleEnum];
