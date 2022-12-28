import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { ClassModule } from './class/class.module';
import { SessionModule } from './session/session.module';
import { TotalModule } from './total/total.module';
import { ResetTokenMiddleware } from './middlewares/reset_token/reset_token.middleware';
import { ClassController } from './class/class.controller';
import { SessionController } from './session/session.controller';
import { TotalController } from './total/total.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: +process.env.PORT_DB,
      username: process.env.USERNAME_DB,
      password: process.env.PASSWORD_DB,
      database: process.env.NAME_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ClassModule,
    SessionModule,
    TotalModule,
  ],
})
export class AppModule {}
