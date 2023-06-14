import * as bcrypt from 'bcrypt';


export const getMongoConnectionUrl = ({username, password, host, port, databaseName, authDatabase}): string => {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
};

export const createPasswordHash = async (password: string, saltRounds: number): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPasswordHash = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
