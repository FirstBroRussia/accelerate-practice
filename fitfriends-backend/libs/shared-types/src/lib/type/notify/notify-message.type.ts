import { NotifyMessageEnum } from "@fitfriends-backend/shared-types";


export type NotifyMessageType = typeof NotifyMessageEnum[keyof typeof NotifyMessageEnum];
