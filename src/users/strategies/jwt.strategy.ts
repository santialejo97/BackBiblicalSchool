import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Payload } from 'src/common/interfaces/globla.interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    config: ConfigService,
  ) {
    super({
      secretOrKey: config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: Payload) {
    const { email, id } = payload;

    const user = await this.userRespository.findOne({ where: { idUser: id } });
    if (!user) throw new UnauthorizedException('User not found');

    return payload;
  }
}
