import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Total } from './entities/total.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { Payload } from 'src/common/interfaces/globla.interfaces';

@Injectable()
export class TotalService {
  private logger = new Logger('TotalService');

  constructor(
    @InjectRepository(Total)
    private readonly totalRepository: Repository<Total>,
    @InjectRepository(User)
    private readonly userRepositoty: Repository<User>,
    private userServices: UsersService,
  ) {}

  async create(createTotalDto: CreateTotalDto, user: User) {
    const { clase } = createTotalDto;
    const registers = await this.findOne(user.idUser, clase);
    if (registers.length === 3)
      throw new BadRequestException('the number of attempts was reached');
    try {
      const registro = this.totalRepository.create({
        ...createTotalDto,
        userId: user,
      });

      const payload: Payload = {
        id: user.idUser,
        email: user.email,
      };

      await this.totalRepository.save(registro);
      return { registro, token: this.userServices.getJwtUser(payload) };
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  async findOne(userId: string, clase: string) {
    const user = await this.userRepositoty.findOneBy({ idUser: userId });
    if (!user) throw new NotFoundException('Not exit user with id');

    const registers = await this.totalRepository.findBy({
      userId: user,
      clase: clase,
    });

    if (!registers)
      throw new NotFoundException(`Not fount registers with is ID : ${userId}`);

    return registers;
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
