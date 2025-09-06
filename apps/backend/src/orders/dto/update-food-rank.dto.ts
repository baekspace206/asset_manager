import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodRankDto } from './create-food-rank.dto';

export class UpdateFoodRankDto extends PartialType(CreateFoodRankDto) {}