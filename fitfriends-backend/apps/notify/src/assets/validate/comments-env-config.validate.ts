import { IsInt, IsString, Max, Min, validateSync } from "class-validator";
import { NotifyMicroserviceEnvInterface } from "../interface/notify-microservice-env.interface";
import { plainToInstance } from "class-transformer";

class NotifyEnvValidateConfig implements NotifyMicroserviceEnvInterface {
  @IsString()
  HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  MONGO_DB_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  MONGO_DB_PORT: number;


  @IsString()
  MONGO_DB_NAME: string;

  @IsString()
  MONGO_AUTH_BASE: string;

  @IsString()
  MONGO_DB_USERNAME: string;

  @IsString()
  MONGO_DB_PASSWORD: string;


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


  @IsString()
  MAIL_SMTP_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  MAIL_SMTP_PORT: number;

  @IsString()
  MAIL_USERNAME: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  MAIL_FROM: string;

}

export function notifyEnvValidateConfig(config: Record<string, unknown>) {
  const transformConfig = plainToInstance(NotifyEnvValidateConfig, config, { enableImplicitConversion: true, });

  const errors = validateSync(transformConfig);

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return transformConfig;
}

