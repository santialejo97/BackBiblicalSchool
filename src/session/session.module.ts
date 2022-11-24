import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';

@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [TypeOrmModule.forFeature([Session]), UsersModule],
})
export class SessionModule {}
