import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  foodType: string;

  @IsNotEmpty()
  @IsString()
  details: string;
}