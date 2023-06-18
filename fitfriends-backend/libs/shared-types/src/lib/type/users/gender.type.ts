import { GenderEnum } from "@fitfriends-backend/shared-types";


export type GenderType = typeof GenderEnum[keyof typeof GenderEnum];
