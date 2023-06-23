import * as bcrypt from 'bcrypt';

import { ClassConstructor, plainToInstance } from 'class-transformer';


export const getMongoConnectionUrl = ({username, password, host, port, databaseName, authDatabase}): string => {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
};

export const generateHash = async (string: string): Promise<string> => {
  const saltRounds = 10; // Количество раундов хеширования

  return await bcrypt.hash(string, saltRounds);
}

export const compareHash = async (targetString: string, generatedHash: string): Promise<boolean> => {
  return await bcrypt.compare(targetString, generatedHash);
}

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
