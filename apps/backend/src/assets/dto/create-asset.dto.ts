import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  note?: string;
}