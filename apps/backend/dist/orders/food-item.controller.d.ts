import { FoodItemService } from './food-item.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { CreateFoodRatingDto } from './dto/create-food-rating.dto';
import { UpdateFoodRatingDto } from './dto/update-food-rating.dto';
import { UsersService } from '../users/users.service';
export declare class FoodItemController {
    private readonly foodItemService;
    private readonly usersService;
    constructor(foodItemService: FoodItemService, usersService: UsersService);
    create(createFoodItemDto: CreateFoodItemDto, req: any): Promise<import("./entities/food-item.entity").FoodItem>;
    findAll(filter?: string, sort?: string): Promise<import("./food-item.service").FoodItemWithRatings[]>;
    findOne(id: string): Promise<import("./food-item.service").FoodItemWithRatings>;
    addRating(id: string, createRatingDto: CreateFoodRatingDto, req: any): Promise<import("./entities/food-rating.entity").FoodRating>;
    updateRating(id: string, updateRatingDto: UpdateFoodRatingDto, req: any): Promise<import("./entities/food-rating.entity").FoodRating>;
    deleteRating(id: string, req: any): Promise<{
        success: boolean;
    }>;
    deleteFoodItem(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
