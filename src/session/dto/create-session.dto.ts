import { IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  titleSession: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  numberSession: number;

  @IsString()
  video: string;

  @IsUUID()
  @IsString()
  claseId: string;
}
