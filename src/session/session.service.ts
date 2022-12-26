import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Clase } from 'src/class/entities/class.entity';

@Injectable()
export class SessionService {
  private logger = new Logger('SessionService');

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Clase)
    private readonly claseRespository: Repository<Clase>,
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const { claseId, ...detail } = createSessionDto;

    try {
      const clase = await this.claseRespository.findOneBy({ idClass: claseId });

      const session = this.sessionRepository.create({
        ...detail,
        idClass: clase,
      });

      await this.sessionRepository.save(session);

      return session;
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  async findOne(id: string) {
    const sesion = await this.sessionRepository.findOneBy({ idSession: id });
    if (!sesion) {
      throw new NotFoundException(`Not exit session with id ${id}`);
    }
    return sesion;
  }

  async update(id: string, updateSessionDto: UpdateSessionDto) {
    try {
      this.findOne(id);
      const sesion = await this.sessionRepository.preload({
        idSession: id,
        ...updateSessionDto,
      });

      await this.sessionRepository.save(sesion);

      return `The session with id: ${id} was update`;
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      this.findOne(id);
      this.sessionRepository.delete({ idSession: id });
      return `This action removes a #${id} session`;
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  handlerErrorException(error: any) {
    if (error.errno == 1062) {
      this.logger.error(error.sqlMessage);
      throw new BadRequestException(error.sqlMessage);
    }

    this.logger.error(error.message);
    console.log(error);
    throw new InternalServerErrorException(
      'Internal exception Serve, you talk with the admin',
    );
  }
}
