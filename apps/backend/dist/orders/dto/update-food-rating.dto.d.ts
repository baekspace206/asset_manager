import { CreateFoodRatingDto } from './create-food-rating.dto';
declare const UpdateFoodRatingDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateFoodRatingDto>>;
export declare class UpdateFoodRatingDto extends UpdateFoodRatingDto_base {
    rating?: number;
    comment?: string;
}
export {};
