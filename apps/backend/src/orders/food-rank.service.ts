import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodRank } from './entities/food-rank.entity';
import { CreateFoodRankDto } from './dto/create-food-rank.dto';
import { UpdateFoodRankDto } from './dto/update-food-rank.dto';

@Injectable()
export class FoodRankService {
  constructor(
    @InjectRepository(FoodRank)
    private foodRankRepository: Repository<FoodRank>,
  ) {}

  async create(createFoodRankDto: CreateFoodRankDto, userId: number): Promise<FoodRank> {
    const foodRank = this.foodRankRepository.create({
      ...createFoodRankDto,
      userId,
      date: new Date(createFoodRankDto.date),
      orderId: createFoodRankDto.orderId || undefined,
    });
    return this.foodRankRepository.save(foodRank);
  }

  async findAll(userId: number): Promise<FoodRank[]> {
    return this.foodRankRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<FoodRank> {
    const foodRank = await this.foodRankRepository.findOne({
      where: { id, userId },
    });
    if (!foodRank) {
      throw new NotFoundException('Food rank not found');
    }
    return foodRank;
  }

  async update(id: number, updateFoodRankDto: UpdateFoodRankDto, userId: number): Promise<FoodRank> {
    const foodRank = await this.findOne(id, userId);
    
    if (updateFoodRankDto.date) {
      updateFoodRankDto.date = new Date(updateFoodRankDto.date).toISOString();
    }
    
    Object.assign(foodRank, updateFoodRankDto);
    return this.foodRankRepository.save(foodRank);
  }

  async remove(id: number, userId: number): Promise<{ success: boolean }> {
    const foodRank = await this.findOne(id, userId);
    await this.foodRankRepository.remove(foodRank);
    return { success: true };
  }

  async findByOrderId(orderId: number, userId: number): Promise<FoodRank | null> {
    return this.foodRankRepository.findOne({
      where: { orderId, userId },
    });
  }
}