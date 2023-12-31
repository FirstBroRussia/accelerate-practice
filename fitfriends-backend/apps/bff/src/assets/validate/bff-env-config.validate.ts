import { IsInt, IsString, Max, Min, validateSync } from "class-validator";
import { BffMicroserviceEnvInterface } from "../interface/bff-microservice-env.interface";
import { plainToInstance } from "class-transformer";


class BffEnvValidateConfig implements BffMicroserviceEnvInterface {
  @IsString()
  HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  UPLOAD_FILES_DIR: string;

  @IsString()
  AVATAR_FILE_SIZE_LIMIT: string;


  @IsString()
  USERS_MICROSERVICE_URL: string;

  @IsString()
  JWT_MICROSERVICE_URL: string;

  @IsString()
  TRAININGS_MICROSERVICE_URL: string;

  @IsString()
  ORDERS_MICROSERVICE_URL: string;

  @IsString()
  COMMENTS_MICROSERVICE_URL: string;



  @IsString()
  RABBIT_USER: string;

  @IsString()
  RABBIT_PASSWORD: string;

  @IsString()
  RABBIT_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  RABBIT_PORT: number;

  @IsString()
  RABBIT_QUEUE: string;

}

export function bffEnvValidateConfig(config: Record<string, unknown>) {
  const transformConfig = plainToInstance(BffEnvValidateConfig, config, { enableImplicitConversion: true, });

  const errors = validateSync(transformConfig);

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return transformConfig;
}

