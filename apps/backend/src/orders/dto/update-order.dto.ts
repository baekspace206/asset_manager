import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class CompleteOrderDto {
  @IsOptional()
  @IsString()
  completedImage?: string;

  @IsOptional()
  @IsString()
  completedComment?: string;

  // Food Rank fields
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

  @IsOptional()
  @IsString()
  rankComment?: string;
}