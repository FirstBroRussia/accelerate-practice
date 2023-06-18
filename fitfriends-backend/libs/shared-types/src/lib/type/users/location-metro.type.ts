import { LocationMetroEnum } from "@fitfriends-backend/shared-types";

export type LocationMetroType = typeof LocationMetroEnum[keyof typeof LocationMetroEnum];
