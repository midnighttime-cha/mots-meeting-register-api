import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRegisterController } from './meeting-register/meeting-register.controller';
import { MeetingRegisterService } from './meeting-register/meeting-register.service';
import { ResponseModule } from './shared/response/response.module';
import { HelpersModule } from './shared/helpers/helpers.module';
import { SystemParamController } from './setting/system-param/system-param.controller';
import { SystemParamService } from './setting/system-param/system-param.service';
import { SettingModule } from './setting/setting.module';
import { MeetingRegisterModule } from './meeting-register/meeting-register.module';
import { HttpExceptionFilter } from './shared/filter/http-exception.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor';
const fs = require("fs");

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        name: "default",
        type: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        schema: process.env.DB_SCHEMA,
        entities: [
          "dist/**/entities/*.entity{.ts,.js}"
        ],
        synchronize: true,
        logging: process.env.SERVER_TYPE === 'LOCAL' ? true : false,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        retryDelay: 300,
        applicationName: "MOTS Meeting API",
        maxQueryExecutionTime: process.env.SERVER_TYPE === 'LOCAL' ? 300 : 0,
        connectTimeoutMS: 30000,
        extra: {
          ssl: {
            rejectUnauthorized: false,
            ca: fs.readFileSync(process.env.SSL_CERT),
          },
          max: 40,
          connectionTimeoutMillis: 30000,
        }
      }
    ),
    ResponseModule,
    HelpersModule,
    SettingModule,
    MeetingRegisterModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ],
})
export class AppModule { }
