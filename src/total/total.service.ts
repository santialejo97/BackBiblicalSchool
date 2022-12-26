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

@Injectable()
export class TotalService {
  private logger = new Logger('TotalService');

  constructor(
    @InjectRepository(Total)
    private readonly totalRepository: Repository<Total>,
    @InjectRepository(User)
    private readonly userRepositoty: Repository<User>,
  ) {}

  async create(createTotalDto: CreateTotalDto, user: User) {
    const registers = await this.findOne(user.idUser);
    if (registers.length === 3)
      throw new BadRequestException('the number of attempts was reached');
    try {
      const registro = this.totalRepository.create({
        ...createTotalDto,
        userId: user,
      });

      await this.totalRepository.save(registro);
      return registro;
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  async findOne(userId: string) {
    const user = await this.userRepositoty.findOneBy({ idUser: userId });
    if (!user) throw new NotFoundException('Not exit user with id');

    const registers = await this.totalRepository.findBy({ userId: user });

    if (!registers)
      throw new NotFoundException(`Not fount registers with is ID : ${userId}`);
    console.log(registers);
    return registers;
  }

  async update(id: string, updateTotalDto: UpdateTotalDto) {
    return `This action updates a #${id} total`;
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
