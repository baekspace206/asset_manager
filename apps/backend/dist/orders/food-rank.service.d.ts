import { Repository } from 'typeorm';
import { FoodRank } from './entities/food-rank.entity';
import { CreateFoodRankDto } from './dto/create-food-rank.dto';
import { UpdateFoodRankDto } from './dto/update-food-rank.dto';
export declare class FoodRankService {
    private foodRankRepository;
    constructor(foodRankRepository: Repository<FoodRank>);
    create(createFoodRankDto: CreateFoodRankDto, userId: number): Promise<FoodRank>;
    findAll(userId: number): Promise<FoodRank[]>;
    findOne(id: number, userId: number): Promise<FoodRank>;
    update(id: number, updateFoodRankDto: UpdateFoodRankDto, userId: number): Promise<FoodRank>;
    remove(id: number, userId: number): Promise<{
        success: boolean;
    }>;
    findByOrderId(orderId: number, userId: number): Promise<FoodRank | null>;
}
