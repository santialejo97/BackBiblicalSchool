import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ValidAccessService } from './valid_access.service';
import { CreateValidAccessDto } from './dto/create-valid_access.dto';
import { UpdateValidAccessDto } from './dto/update-valid_access.dto';

@Controller('validaccess')
export class ValidAccessController {
  constructor(private readonly validAccessService: ValidAccessService) {}

  @Get('valid')
  validAccess(@Query('token') token: string) {
    return this.validAccessService.validarToken(token);
  }
}
