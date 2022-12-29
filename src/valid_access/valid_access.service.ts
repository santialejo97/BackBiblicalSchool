import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateValidAccessDto } from './dto/create-valid_access.dto';
import { UpdateValidAccessDto } from './dto/update-valid_access.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/common/interfaces/globla.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ValidAccessService {
  private logger = new Logger('ValidAccessService');
  constructor(
    private readonly jwtServices: JwtService,
    @InjectRepository(User) private readonly userRespository: Repository<User>,
  ) {}

  async validarToken(token: string) {
    try {
      const verify = this.jwtServices.verify(token);
      const user = this.userRespository.findOneBy({ idUser: verify.id });
      if (!user) {
        throw new NotFoundException('User is invalid');
      }
      const payload: Payload = {
        id: verify.id,
        email: verify.email,
      };

      const newToken = this.jwtServices.sign(payload);
      return {
        ok: true,
        newToken,
      };
    } catch (error) {
      throw new BadRequestException('Invalid asignature');
    }
  }
}
