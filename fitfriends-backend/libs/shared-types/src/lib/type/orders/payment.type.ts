import { PaymentEnum } from "@fitfriends-backend/shared-types";


export type PaymentType = typeof PaymentEnum[keyof typeof PaymentEnum];
