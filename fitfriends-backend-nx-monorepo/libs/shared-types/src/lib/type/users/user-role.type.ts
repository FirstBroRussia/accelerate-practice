import { UserRoleEnum } from "@fitfriends-backend-nx-monorepo/shared-types";


export type UserRoleType = typeof UserRoleEnum[keyof typeof UserRoleEnum];
