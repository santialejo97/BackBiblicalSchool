import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/common/interfaces/globla.interfaces';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtServices: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password, ...details } = createUserDto;
    try {
      const user = this.userRepository.create({
        ...details,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        user,
        token: this.getJwtUser({ id: user.idUser, email: user.email }),
      };
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  login() {
    return `This action returns all users`;
  }

  getJwtUser(payload: Payload): string {
    return this.jwtServices.sign(payload);
  }

  handlerErrorException(error: any) {
    this.logger.error(error.sqlMessage);
    console.log(error);
    if (error.errno == 1062) {
      throw new BadRequestException(error.sqlMessage);
    }

    throw new InternalServerErrorException(
      'Internal exception Serve, you talk with the admin',
    );
  }
}
