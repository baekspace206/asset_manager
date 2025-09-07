import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateDiaryDto {
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;
}