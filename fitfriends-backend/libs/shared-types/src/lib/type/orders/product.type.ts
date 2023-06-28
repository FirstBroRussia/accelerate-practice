import { ProductEnum } from "@fitfriends-backend/shared-types";


export type ProductType = typeof ProductEnum[keyof typeof ProductEnum];
