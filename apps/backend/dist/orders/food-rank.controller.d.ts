import { FoodRankService } from './food-rank.service';
import { CreateFoodRankDto } from './dto/create-food-rank.dto';
import { UpdateFoodRankDto } from './dto/update-food-rank.dto';
import { UsersService } from '../users/users.service';
export declare class FoodRankController {
    private readonly foodRankService;
    private readonly usersService;
    constructor(foodRankService: FoodRankService, usersService: UsersService);
    create(createFoodRankDto: CreateFoodRankDto, req: any): Promise<import("./entities/food-rank.entity").FoodRank>;
    findAll(req: any): Promise<import("./entities/food-rank.entity").FoodRank[]>;
    findOne(id: string, req: any): Promise<import("./entities/food-rank.entity").FoodRank>;
    update(id: string, updateFoodRankDto: UpdateFoodRankDto, req: any): Promise<import("./entities/food-rank.entity").FoodRank>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
