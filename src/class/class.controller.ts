import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Auth } from 'src/common/decorators/auth/auth.decorators';
import { validRoles } from 'src/common/interfaces/globla.interfaces';
import { getUser } from 'src/users/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('create')
  @Auth(validRoles.admin)
  createClass(@Body() createClassDto: CreateClassDto, @getUser() user: User) {
    return this.classService.create(createClassDto, user);
  }

  @Get('findAll')
  @Auth(validRoles.admin)
  findAll(@Query() paginador: PaginationDto) {
    return this.classService.findAll(paginador);
  }

  @Get('find/:term')
  @Auth(validRoles.admin)
  findOne(@Param('term') term: string) {
    return this.classService.findOne(term);
  }

  @Patch('update/:id')
  @Auth(validRoles.admin)
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

  @Delete('inabilited/:id')
  @Auth(validRoles.admin)
  inabilited(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classService.inabilited(id, updateClassDto);
  }
}
