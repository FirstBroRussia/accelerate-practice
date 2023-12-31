import { Expose, Transform, Type } from "class-transformer";
import { ONE_VALUE } from "../constant/common.constant";
import { IsInt, Min, isEnum, IsEnum } from "class-validator";
import { AscDescSortEnum } from "../enum/common/asc-desc-sort.enum";
import { AscDescSortType } from "../type/common/asc-desc-sort.type";


export class GetFriendsListQuery {
  @Expose()
  @Transform(({ value }) => {
    if (!value || isNaN(value) || value < ONE_VALUE) {
      return ONE_VALUE;
    }

    return value;
  })
  @Type(() => Number)
  @IsInt()
  @Min(ONE_VALUE)
  page?: number;

  @Expose()
  @Transform(({value}) => {
    if (!value || !isEnum(value, AscDescSortEnum)) {
      return AscDescSortEnum.Desc;
    }

    return value;
  })
  @Type(() => String)
  @IsEnum(AscDescSortEnum)
  sort?: AscDescSortType;
}
