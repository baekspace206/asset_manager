import { FoodRating } from './food-rating.entity';
export declare class FoodItem {
    id: number;
    orderId: number;
    foodType: string;
    restaurantName: string;
    foodImage: string;
    date: Date;
    description: string | null;
    createdBy: number;
    ratings: FoodRating[];
    createdAt: Date;
    updatedAt: Date;
}
