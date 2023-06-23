import { IsInt, IsString, Max, Min, validateSync } from "class-validator";
import { CabinetMicroserviceEnvInterface } from "../interface/cabinet-microservice-env.interface";
import { plainToInstance } from "class-transformer";

class CabinetEnvValidateConfig implements CabinetMicroserviceEnvInterface {
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

}

export function cabinetEnvValidateConfig(config: Record<string, unknown>) {
  const transformConfig = plainToInstance(CabinetEnvValidateConfig, config, { enableImplicitConversion: true, });

  const errors = validateSync(transformConfig);

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return transformConfig;
}

