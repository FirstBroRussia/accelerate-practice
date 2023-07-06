import { Expose, Transform, Type } from "class-transformer";
import { IsNotEmpty, isEnum } from "class-validator";
import { RequestTrainingStatusEnum } from "../../enum/users/request-training-status.enum";
import { BadRequestException } from "@nestjs/common";
import { RequestTrainingStatusType } from "../../type/users/request-training-status.type";


export class UpdateStatusRequestTrainingDto {
  @Expose()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (!isEnum(value, RequestTrainingStatusEnum) || value === RequestTrainingStatusEnum.Waiting) {
      throw new BadRequestException('Передан некорректный новый статус.');
    }

    return value;
  })
  @Type(() => String)
  status: Omit<RequestTrainingStatusType, "Waiting">;

}
