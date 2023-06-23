import { IsInt, IsString, Max, Min, validateSync } from "class-validator";
import { JwtMicroserviceEnvInterface } from "../interface/jwt-microservice-env.interface";
import { plainToInstance } from "class-transformer";

class JwtEnvValidateConfig implements JwtMicroserviceEnvInterface {
  @IsString()
  HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  REFRESH_TOKEN_EXPIRATION_TIME: string;

  @IsString()
  USERS_MICROSERVICE_URL: string;

  @IsString()
  GENERATE_UNIQUE_HASH_STRING: string;

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

}

export function jwtEnvValidateConfig(config: Record<string, unknown>) {
  const transformConfig = plainToInstance(JwtEnvValidateConfig, config, { enableImplicitConversion: true, });

  const errors = validateSync(transformConfig);

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return transformConfig;
}

