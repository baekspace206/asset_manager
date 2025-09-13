import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodItem } from './entities/food-item.entity';
import { FoodRating } from './entities/food-rating.entity';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { CreateFoodRatingDto } from './dto/create-food-rating.dto';
import { UpdateFoodRatingDto } from './dto/update-food-rating.dto';

export interface FoodItemWithRatings extends FoodItem {
  baekRating?: FoodRating;
  jeongRating?: FoodRating;
  averageRating?: number;
  ratingCount: number;
  isCompleted: boolean; // 두 사용자 모두 평가했는지
}

@Injectable()
export class FoodItemService {
  constructor(
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
    @InjectRepository(FoodRating)
    private foodRatingRepository: Repository<FoodRating>,
  ) {}

  async create(createFoodItemDto: CreateFoodItemDto, userId: number): Promise<FoodItem> {
    const foodItem = this.foodItemRepository.create({
      ...createFoodItemDto,
      date: new Date(createFoodItemDto.date),
      createdBy: userId,
    });
    return this.foodItemRepository.save(foodItem);
  }

  async findAllWithRatings(): Promise<FoodItemWithRatings[]> {
    const foodItems = await this.foodItemRepository.find({
      relations: ['ratings'],
      order: { createdAt: 'DESC' },
    });

    return foodItems.map(item => this.mapToFoodItemWithRatings(item));
  }

  async findOne(id: number): Promise<FoodItemWithRatings> {
    const foodItem = await this.foodItemRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });

    if (!foodItem) {
      throw new NotFoundException('Food item not found');
    }

    return this.mapToFoodItemWithRatings(foodItem);
  }

  async addRating(createRatingDto: CreateFoodRatingDto, userId: number): Promise<FoodRating> {
    // 이미 평가했는지 확인
    const existingRating = await this.foodRatingRepository.findOne({
      where: { foodItemId: createRatingDto.foodItemId, userId },
    });

    if (existingRating) {
      throw new Error('User has already rated this food item');
    }

    const rating = this.foodRatingRepository.create({
      ...createRatingDto,
      userId,
    });

    return this.foodRatingRepository.save(rating);
  }

  async updateRating(foodItemId: number, updateRatingDto: UpdateFoodRatingDto, userId: number): Promise<FoodRating> {
    const rating = await this.foodRatingRepository.findOne({
      where: { foodItemId, userId },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    Object.assign(rating, updateRatingDto);
    return this.foodRatingRepository.save(rating);
  }

  async deleteRating(foodItemId: number, userId: number): Promise<{ success: boolean }> {
    const rating = await this.foodRatingRepository.findOne({
      where: { foodItemId, userId },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    await this.foodRatingRepository.remove(rating);
    return { success: true };
  }

  async deleteFoodItem(id: number, userId: number): Promise<{ success: boolean }> {
    const foodItem = await this.foodItemRepository.findOne({
      where: { id },
      relations: ['ratings'],
    });

    if (!foodItem) {
      throw new NotFoundException('Food item not found');
    }

    // 관련된 모든 평가들도 함께 삭제
    if (foodItem.ratings && foodItem.ratings.length > 0) {
      await this.foodRatingRepository.remove(foodItem.ratings);
    }

    await this.foodItemRepository.remove(foodItem);
    return { success: true };
  }

  private mapToFoodItemWithRatings(item: FoodItem): FoodItemWithRatings {
    const baekRating = item.ratings?.find(r => r.userId === this.getBaekUserId());
    const jeongRating = item.ratings?.find(r => r.userId === this.getJeongUserId());
    
    const ratings = item.ratings?.filter(r => r.rating) || [];
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
      : undefined;

    return {
      ...item,
      baekRating,
      jeongRating,
      averageRating,
      ratingCount: ratings.length,
      isCompleted: baekRating !== undefined && jeongRating !== undefined,
    };
  }

  // 사용자 ID를 가져오는 헬퍼 메서드 (실제 구현에서는 사용자 서비스에서 가져와야 함)
  private getBaekUserId(): number {
    // TODO: 실제 baek 사용자 ID를 동적으로 가져오기
    return 19; // 현재 baek의 ID
  }

  private getJeongUserId(): number {
    // TODO: 실제 jeong 사용자 ID를 동적으로 가져오기
    return 1; // jeong의 ID (가정)
  }

  // 필터링 메서드들
  async getCompletedItems(): Promise<FoodItemWithRatings[]> {
    const allItems = await this.findAllWithRatings();
    return allItems.filter(item => item.isCompleted);
  }

  async getIncompleteItems(): Promise<FoodItemWithRatings[]> {
    const allItems = await this.findAllWithRatings();
    return allItems.filter(item => !item.isCompleted);
  }

  async getBaekRatedItems(): Promise<FoodItemWithRatings[]> {
    const allItems = await this.findAllWithRatings();
    return allItems.filter(item => item.baekRating !== undefined);
  }

  async getJeongRatedItems(): Promise<FoodItemWithRatings[]> {
    const allItems = await this.findAllWithRatings();
    return allItems.filter(item => item.jeongRating !== undefined);
  }

  async getItemsSortedByRating(order: 'asc' | 'desc' = 'desc'): Promise<FoodItemWithRatings[]> {
    const allItems = await this.findAllWithRatings();
    return allItems
      .filter(item => item.averageRating !== undefined)
      .sort((a, b) => {
        const aRating = a.averageRating || 0;
        const bRating = b.averageRating || 0;
        return order === 'desc' ? bRating - aRating : aRating - bRating;
      });
  }
}