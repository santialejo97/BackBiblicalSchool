import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtStrategy } from 'src/users/strategies/jwt.strategy';

@Injectable()
export class ResetTokenMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: any, next: () => void) {
    console.log('Estamos pasando por el middleware');

    next();
  }
}

// export function ResetTokenMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   console.log(`Request...`, req);

//   next();
// }
