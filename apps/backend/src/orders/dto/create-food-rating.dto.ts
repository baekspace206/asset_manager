import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateFoodRatingDto {
  @IsNumber()
  foodItemId: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}