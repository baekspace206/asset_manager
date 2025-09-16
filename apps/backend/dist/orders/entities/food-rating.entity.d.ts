import { FoodItem } from './food-item.entity';
export declare class FoodRating {
    id: number;
    foodItemId: number;
    userId: number;
    rating: number;
    comment: string | null;
    foodItem: FoodItem;
    createdAt: Date;
    updatedAt: Date;
}
