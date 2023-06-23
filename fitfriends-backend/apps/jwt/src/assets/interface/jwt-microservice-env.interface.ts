export interface JwtMicroserviceEnvInterface {
  HOST: string;
  PORT: number;

  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;

  ACCESS_TOKEN_EXPIRATION_TIME: string;
  REFRESH_TOKEN_EXPIRATION_TIME: string;

  GENERATE_UNIQUE_HASH_STRING: string;

  USERS_MICROSERVICE_URL: string;


  MONGO_DB_HOST: string;
  MONGO_DB_PORT: number;
  MONGO_DB_USERNAME: string;
  MONGO_DB_PASSWORD: string;
  MONGO_DB_NAME: string;
  MONGO_AUTH_BASE: string;


}
