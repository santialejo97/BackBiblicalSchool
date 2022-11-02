import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/common/interfaces/globla.interfaces';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validRoles } from '../common/interfaces/globla.interfaces';

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
        ok: true,
        user,
        token: this.getJwtUser({ id: user.idUser, email: user.email }),
      };
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    console.log(password);
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new NotFoundException(`The email ${email} or Password is invalid`);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(
        `The email ${email} or Password is invalid`,
      );

    delete user.password;

    const token = this.getJwtUser({ id: user.idUser, email });
    return { ok: true, user, token };
  }

  async findAll(pagination: PaginationDto) {
    const { limit = 10, offset = 0 } = pagination;
    try {
      const users = await this.userRepository.find({
        take: limit,
        skip: offset,
        select: {
          email: true,
          idUser: true,
          isActive: true,
          roleUser: true,
          nameUser: true,
        },
      });

      return users.map((user) => ({ user }));
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  async findOne(term: string) {
    let user: User;
    if (uuid.validate(term)) {
      user = await this.userRepository.findOneBy({ idUser: term });
    } else {
      // ! Convertir el buscador en key sensity
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      user = await queryBuilder
        .where('UPPER(nameUser) = :nameUser', { nameUser: term.toUpperCase() })
        .getOne();
    }
    if (!user)
      throw new NotFoundException(`The user with id ${term} not found `);
    delete user.password;
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, userToken: User) {
    const { roleUser } = userToken;
    const { password, ...details } = updateUserDto;
    console.log(userToken);
    if (roleUser == validRoles.user) {
      if (Object.keys(updateUserDto).includes('roleUser')) {
        console.log('quitando role');
        delete details.roleUser;
        delete details.isActive;
      }
    }

    if (Object.entries(updateUserDto).length === 0)
      throw new BadRequestException('Not is update user without data');

    const user = await this.userRepository.preload({
      idUser: id,
      ...details,
      password: !password
        ? password
        : bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });

    if (!user)
      throw new BadRequestException(`The user with id ${id} not found`);

    let token: string;

    if (roleUser == validRoles.user) {
      if (user.isActive) token = this.getJwtUser({ id, email: user.email });
    }

    try {
      await this.userRepository.save(user);
      delete user.password;
      return {
        ok: true,
        user,
        token,
      };
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  getJwtUser(payload: Payload): string {
    return this.jwtServices.sign(payload);
  }

  handlerErrorException(error: any) {
    console.log(error);
    if (error.errno == 1062) {
      this.logger.error(error.sqlMessage);
      throw new BadRequestException(error.sqlMessage);
    }

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Internal exception Serve, you talk with the admin',
    );
  }
}
