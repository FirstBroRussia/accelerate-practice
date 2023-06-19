import * as bcrypt from 'bcrypt';

import { ClassConstructor, plainToInstance } from 'class-transformer';


export const getMongoConnectionUrl = ({username, password, host, port, databaseName, authDatabase}): string => {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
};

export const createPasswordHash = async (password: string, saltRounds: number): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPasswordHash = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const fillDTOWithExcludeExtraneousValues = <T, V>(someDto: ClassConstructor<T>, plainObject: V): T => {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
};

export const fillRDO = <T, V>(someRdo: ClassConstructor<T>, plainObject: V): T => {
  return plainToInstance(someRdo, plainObject, { excludeExtraneousValues: true });
};

export const checkString = (str, searchString): boolean => {
  if (typeof searchString === 'string') {
    return str.includes(searchString);
  } else if (searchString instanceof RegExp) {
    return searchString.test(str);
  } else {
    throw new Error('Invalid searchString');
  }
}
