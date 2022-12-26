import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { TotalService } from './total.service';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';
import { getUser } from '../users/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Auth } from 'src/common/decorators/auth/auth.decorators';
import { validRoles } from 'src/common/interfaces/globla.interfaces';

@Controller('total')
export class TotalController {
  constructor(private readonly totalService: TotalService) {}

  @Post('create')
  @Auth(validRoles.user, validRoles.admin)
  create(@Body() createTotalDto: CreateTotalDto, @getUser() user: User) {
    return this.totalService.create(createTotalDto, user);
  }

  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.totalService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateTotalDto: UpdateTotalDto) {
    return this.totalService.update(id, updateTotalDto);
  }
}
