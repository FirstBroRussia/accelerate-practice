import { Expose, Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, Min, isEnum } from "class-validator";
import { UserRoleEnum } from "../enum/users/user-role.enum";
import { ONE_VALUE } from "../constant/common.constant";
import { AscDescSortEnum } from "../enum/common/asc-desc-sort.enum";
import { AscDescSortType } from "../type/common/asc-desc-sort.type";
import { UserRoleType } from "../type/users/user-role.type";


export class GetDocumentQuery {
  @Expose()
  @Type(() => String)
  @IsEnum(UserRoleEnum)
  role?: UserRoleType;

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
