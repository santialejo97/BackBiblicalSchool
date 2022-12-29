import { PartialType } from '@nestjs/mapped-types';
import { CreateValidAccessDto } from './create-valid_access.dto';

export class UpdateValidAccessDto extends PartialType(CreateValidAccessDto) {}
