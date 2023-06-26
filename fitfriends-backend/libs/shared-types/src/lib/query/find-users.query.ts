import { AscDescSortEnum, AscDescSortType, IsLocationMetroTypeArrayValidator, IsTrainingTypeArrayValidator, LocationMetroType, ONE_VALUE, SkillLevelEnum, SkillLevelType, TrainingType, UserRoleEnum, UserRoleType } from "@fitfriends-backend/shared-types";
import { Expose, Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, Min, isEnum } from "class-validator";


export class FindUsersQuery {
  @Expose()
  @Transform(({value}) => {
    if (!value) {
      return UserRoleEnum.Student;
    }

    return value;
  })
  @Type(() => String)
  @IsEnum(UserRoleEnum)
  role?: UserRoleType;

  @Expose()
  @Transform(({value}) => {
    if (!value) {
      return [];
    }

    return (value as string).split(',');
  })
  @Type(() => Array)
  @IsArray()
  @IsLocationMetroTypeArrayValidator({ message: 'Значение в массиве не соответствует дефолтным!' })
  location?: LocationMetroType[];

  @Expose()
  @Transform(({value}) => {
    if (!value) {
      return [];
    }

    return (value as string).split(',');
  })
  @Type(() => Array)
  @IsArray()
  @IsTrainingTypeArrayValidator({ message: 'Значение в массиве не соответствует дефолтным!' })
  trainingType?: TrainingType[];

  @Expose()
  @Type(() => String)
  @IsEnum(SkillLevelEnum)
  skillLevel?: SkillLevelType;

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
