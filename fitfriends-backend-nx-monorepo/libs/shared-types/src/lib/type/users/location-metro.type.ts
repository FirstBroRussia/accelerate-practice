import { LocationMetroEnum } from "@fitfriends-backend-nx-monorepo/shared-types";

export type LocationMetroType = typeof LocationMetroEnum[keyof typeof LocationMetroEnum];
