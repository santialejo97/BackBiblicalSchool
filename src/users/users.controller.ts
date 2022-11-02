import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { validRole } from 'src/common/decorators/auth/validRoles.decorator';
import { validRoles } from 'src/common/interfaces/globla.interfaces';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { Auth } from 'src/common/decorators/auth/auth.decorators';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('list')
  @Auth(validRoles.admin)
  findAll(@Query() pagination: PaginationDto, @getUser() user: User) {
    console.log(user);
    return this.usersService.findAll(pagination);
  }

  @Patch('update/:id')
  @Auth(validRoles.admin, validRoles.user)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @getUser() user: User,
  ) {
    return this.usersService.updateUser(id, updateUserDto, user);
  }

  @Get('find/:term')
  findOneUser(@Param('term') term: string) {
    return this.usersService.findOne(term);
  }
}
