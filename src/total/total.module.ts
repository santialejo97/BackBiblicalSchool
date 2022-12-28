import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TotalService } from './total.service';
import { TotalController } from './total.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Total } from './entities/total.entity';
import { ResetTokenMiddleware } from 'src/middlewares/reset_token/reset_token.middleware';

@Module({
  controllers: [TotalController],
  providers: [TotalService],
  imports: [UsersModule, TypeOrmModule.forFeature([Total])],
})
export class TotalModule {}
