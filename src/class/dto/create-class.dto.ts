import {
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
  IsBoolean,
} from 'class-validator';

export class CreateClassDto {
  @IsString()
  titleClass: string;

  @IsNumber()
  @IsPositive()
  numberSession: number;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
