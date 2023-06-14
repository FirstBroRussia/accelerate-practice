import { GenderEnum } from "@fitfriends-backend-nx-monorepo/shared-types";


export type GenderType = typeof GenderEnum[keyof typeof GenderEnum];
