import { Repository } from 'typeorm';
import { FoodItem } from './entities/food-item.entity';
import { FoodRating } from './entities/food-rating.entity';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { CreateFoodRatingDto } from './dto/create-food-rating.dto';
import { UpdateFoodRatingDto } from './dto/update-food-rating.dto';
import { User } from '../users/entities/user.entity';
export interface FoodItemWithRatings extends FoodItem {
    baekRating?: FoodRating;
    jeongRating?: FoodRating;
    averageRating?: number;
    ratingCount: number;
    isCompleted: boolean;
}
export declare class FoodItemService {
    private foodItemRepository;
    private foodRatingRepository;
    private userRepository;
    private userCache;
    constructor(foodItemRepository: Repository<FoodItem>, foodRatingRepository: Repository<FoodRating>, userRepository: Repository<User>);
    private getUserIds;
    create(createFoodItemDto: CreateFoodItemDto, userId: number): Promise<FoodItem>;
    findAllWithRatings(): Promise<FoodItemWithRatings[]>;
    findOne(id: number): Promise<FoodItemWithRatings>;
    addRating(createRatingDto: CreateFoodRatingDto, userId: number): Promise<FoodRating>;
    updateRating(foodItemId: number, updateRatingDto: UpdateFoodRatingDto, userId: number): Promise<FoodRating>;
    deleteRating(foodItemId: number, userId: number): Promise<{
        success: boolean;
    }>;
    deleteFoodItem(id: number, userId: number): Promise<{
        success: boolean;
    }>;
    private mapToFoodItemWithRatings;
    getCompletedItems(): Promise<FoodItemWithRatings[]>;
    getIncompleteItems(): Promise<FoodItemWithRatings[]>;
    getBaekRatedItems(): Promise<FoodItemWithRatings[]>;
    getJeongRatedItems(): Promise<FoodItemWithRatings[]>;
    getItemsSortedByRating(order?: 'asc' | 'desc'): Promise<FoodItemWithRatings[]>;
}
