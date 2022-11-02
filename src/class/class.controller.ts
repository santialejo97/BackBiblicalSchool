import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Auth } from 'src/common/decorators/auth/auth.decorators';
import { validRoles } from 'src/common/interfaces/globla.interfaces';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('create')
  @Auth(validRoles.admin)
  createClass(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get('findAll')
  @Auth(validRoles.admin)
  findAll() {
    return this.classService.findAll();
  }

  @Get('find/:id')
  @Auth(validRoles.admin)
  findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }

  @Patch('update/:id')
  @Auth(validRoles.admin)
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(+id, updateClassDto);
  }

  @Delete('delete /:id')
  @Auth(validRoles.admin)
  remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}
