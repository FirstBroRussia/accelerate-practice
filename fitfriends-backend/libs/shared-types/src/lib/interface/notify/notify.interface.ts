import { NotifyMessageType } from "@fitfriends-backend/shared-types";


export interface NotifyInterface {
  creatorUserId?: string;

  targetUserId?: string;

  message?: NotifyMessageType;

  createdAt?: string;
}
