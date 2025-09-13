import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateFoodItemDto {
  @IsOptional()
  @IsNumber()
  orderId?: number;

  @IsString()
  @IsNotEmpty()
  foodType: string;

  @IsString()
  @IsNotEmpty()
  restaurantName: string;

  @IsString()
  @IsNotEmpty()
  foodImage: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  description?: string;
}