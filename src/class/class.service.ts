import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Clase } from './entities/class.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import * as uuid from 'uuid';

@Injectable()
export class ClassService {
  private logger = new Logger('ClassService');

  constructor(
    @InjectRepository(Clase)
    private readonly classRepository: Repository<Clase>,
  ) {}

  async create(createClassDto: CreateClassDto, user: User) {
    try {
      const clase = await this.classRepository.create({
        ...createClassDto,
        idUser: user,
      });

      await this.classRepository.save(clase);

      return clase;
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  async findAll(paginador: PaginationDto) {
    const { offset = 0, limit = 10 } = paginador;
    try {
      const classAll = await this.classRepository.find({
        skip: offset,
        take: limit,
      });
      return classAll.map((clase) => ({ clase }));
    } catch (error) {
      this.handlerErrorException(error);
    }
  }

  async findOne(term: string) {
    if (!term) throw new BadRequestException('Not exit string of search');

    if (uuid.validate(term)) {
      const clase = await this.classRepository.findOneBy({ idClass: term });
      if (!clase)
        throw new NotFoundException(`the class with the #${term} not found`);

      return clase;
    } else {
      const queryBuilder = this.classRepository.createQueryBuilder('class');
      const clase = await queryBuilder
        .where('UPPER(slug) like  :slug', {
          slug: `%${term.toUpperCase()}%`,
        })
        .getMany();
      return {
        ok: true,
        clases: clase.map((clase) => ({ clase })),
      };
    }
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    const { ...detail } = updateClassDto;
    if (!uuid.validate(id))
      throw new BadRequestException(`The id ${id} not is a uuid valid`);

    console.log(updateClassDto);
    const clase = await this.classRepository.preload({
      idClass: id,
      ...detail,
    });

    try {
      await this.classRepository.save(clase);
    } catch (error) {
      this.handlerErrorException(error);
    }

    return {
      ok: true,
      clase,
    };
  }

  async inabilited(id: string, updateClassDto: UpdateClassDto) {
    await this.findOne(id);

    const clase = await this.classRepository.update(id, { ...updateClassDto });

    try {
      return { ok: true, msg: `the class with the #${id} was update` };
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
