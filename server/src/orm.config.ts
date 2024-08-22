import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function ormConfig(): TypeOrmModuleOptions {
  const commonConf = {
    SYNCRONIZE: false,
    ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
    MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
    CLI: {
      migrationsDir: 'src/migrations',
    },
    MIGRATIONS_RUN: true,
  };

  let ormconfig: TypeOrmModuleOptions = {
    name: 'default',
    type: 'postgres',
    database: '../target/db/sqlite-dev-db.sql',
    logging: true,
    synchronize: true,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    cli: commonConf.CLI,
    migrationsRun: commonConf.MIGRATIONS_RUN,
  };

  if (process.env.BACKEND_ENV === 'prod') {
    ormconfig = {
      name: 'default',
      type: 'postgres',
      database: 'nestjsreact',
      host: 'postgresql',
      // port: ,
      username: 'nestjsreact',
      password: '',
      logging: false,
      synchronize: commonConf.SYNCRONIZE,
      entities: commonConf.ENTITIES,
      migrations: commonConf.MIGRATIONS,
      cli: commonConf.CLI,
      migrationsRun: commonConf.MIGRATIONS_RUN,
    };
  }

  if (process.env.BACKEND_ENV === 'test') {
    ormconfig = {
      name: 'default',
      type: 'sqlite',
      database: ':memory:',
      keepConnectionAlive: true,
      logging: true,
      synchronize: true,
      entities: commonConf.ENTITIES,
      migrations: commonConf.MIGRATIONS,
      cli: commonConf.CLI,
      migrationsRun: commonConf.MIGRATIONS_RUN,
    };
  }

  if (process.env.BACKEND_ENV === 'dev') {
    ormconfig = {
      name: 'default',
      type: 'postgres',
      database: 'nestjsreact',
      host: 'localhost',
      // port: ,
      username: 'nestjsreact',
      password: '',
      logging: false,
      synchronize: commonConf.SYNCRONIZE,
      entities: commonConf.ENTITIES,
      migrations: commonConf.MIGRATIONS,
      cli: commonConf.CLI,
      migrationsRun: commonConf.MIGRATIONS_RUN,
    };
  }

  return ormconfig;
}

export { ormConfig };
