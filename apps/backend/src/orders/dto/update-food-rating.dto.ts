import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodRatingDto } from './create-food-rating.dto';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateFoodRatingDto extends PartialType(CreateFoodRatingDto) {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  rating?: number;

  @IsOptional()
  comment?: string;
}