export interface BffMicroserviceEnvInterface {
  HOST: string;
  PORT: number;

  UPLOAD_FILES_DIR: string;
  AVATAR_FILE_SIZE_LIMIT: string;

  USERS_MICROSERVICE_URL: string;
  JWT_MICROSERVICE_URL: string;
  TRAININGS_MICROSERVICE_URL: string;
  ORDERS_MICROSERVICE_URL: string;
  COMMENTS_MICROSERVICE_URL: string;

  RABBIT_USER: string;
  RABBIT_PASSWORD: string;
  RABBIT_HOST: string;
  RABBIT_PORT: number;
  RABBIT_QUEUE: string;


}
