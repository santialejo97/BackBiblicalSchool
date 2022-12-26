import {
  IsString,
  IsUUID,
  IsNumber,
  MAX,
  Max,
  Min,
  IsPositive,
} from 'class-validator';

export class CreateTotalDto {
  @IsUUID()
  @IsString()
  clase: string;

  @IsNumber()
  @IsPositive()
  @Max(3)
  @Min(1)
  intento: number;

  @IsNumber()
  @IsPositive()
  @Max(10)
  @Min(1)
  nota?: number;
}
