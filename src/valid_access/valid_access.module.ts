import { Module } from '@nestjs/common';
import { ValidAccessService } from './valid_access.service';
import { ValidAccessController } from './valid_access.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ValidAccessController],
  providers: [ValidAccessService],
  imports: [UsersModule],
})
export class ValidAccessModule {}
