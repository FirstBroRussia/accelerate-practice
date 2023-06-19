import { Expose, Type } from "class-transformer";
import { UserInterface } from "../../interface/users/user.interface";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { UsersMicroserviceConstants } from "../../constant/users-microservice.constant";

export class LoginUserDto implements UserInterface {
  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose()
  @Type(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(UsersMicroserviceConstants.PASSWORD_MIN_LENGTH)
  @MaxLength(UsersMicroserviceConstants.PASSWORD_MAX_LENGTH)
  password: string;

}
