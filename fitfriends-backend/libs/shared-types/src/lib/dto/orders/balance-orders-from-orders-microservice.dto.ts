import { Expose } from "class-transformer";


export class BalanceOrdersFromOrdersMicroserviceDto {
  @Expose()
  productIds: string[];

  @Expose()
  products: {
    productId: string,
    quantity: number,
  }[]
}
