import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, Min, Max } from 'class-validator';

export class CreateFoodRankDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  foodType: string;

  @IsNotEmpty()
  @IsString()
  restaurantName: string;

  @IsNotEmpty()
  @IsString()
  foodImage: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  comment?: string;
}