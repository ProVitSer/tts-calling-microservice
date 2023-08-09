import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions, MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoUseFactory = async (configService: ConfigService): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

const getMongoString = (configService: ConfigService): string => {
  const { username, password, database, host, port } = configService.get('database.mongo');
  return `mongodb://${username}:${password}@${host}:${port}/${database}`;
};

const getMongoOptions = (): MongooseModuleOptions => ({});
