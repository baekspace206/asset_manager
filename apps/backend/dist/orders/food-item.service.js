"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const food_item_entity_1 = require("./entities/food-item.entity");
const food_rating_entity_1 = require("./entities/food-rating.entity");
let FoodItemService = class FoodItemService {
    foodItemRepository;
    foodRatingRepository;
    constructor(foodItemRepository, foodRatingRepository) {
        this.foodItemRepository = foodItemRepository;
        this.foodRatingRepository = foodRatingRepository;
    }
    async create(createFoodItemDto, userId) {
        const foodItem = this.foodItemRepository.create({
            ...createFoodItemDto,
            date: new Date(createFoodItemDto.date),
            createdBy: userId,
        });
        return this.foodItemRepository.save(foodItem);
    }
    async findAllWithRatings() {
        const foodItems = await this.foodItemRepository.find({
            relations: ['ratings'],
            order: { createdAt: 'DESC' },
        });
        return foodItems.map(item => this.mapToFoodItemWithRatings(item));
    }
    async findOne(id) {
        const foodItem = await this.foodItemRepository.findOne({
            where: { id },
            relations: ['ratings'],
        });
        if (!foodItem) {
            throw new common_1.NotFoundException('Food item not found');
        }
        return this.mapToFoodItemWithRatings(foodItem);
    }
    async addRating(createRatingDto, userId) {
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
    async updateRating(foodItemId, updateRatingDto, userId) {
        const rating = await this.foodRatingRepository.findOne({
            where: { foodItemId, userId },
        });
        if (!rating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        Object.assign(rating, updateRatingDto);
        return this.foodRatingRepository.save(rating);
    }
    async deleteRating(foodItemId, userId) {
        const rating = await this.foodRatingRepository.findOne({
            where: { foodItemId, userId },
        });
        if (!rating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        await this.foodRatingRepository.remove(rating);
        return { success: true };
    }
    async deleteFoodItem(id, userId) {
        const foodItem = await this.foodItemRepository.findOne({
            where: { id },
            relations: ['ratings'],
        });
        if (!foodItem) {
            throw new common_1.NotFoundException('Food item not found');
        }
        if (foodItem.ratings && foodItem.ratings.length > 0) {
            await this.foodRatingRepository.remove(foodItem.ratings);
        }
        await this.foodItemRepository.remove(foodItem);
        return { success: true };
    }
    mapToFoodItemWithRatings(item) {
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
    getBaekUserId() {
        return 19;
    }
    getJeongUserId() {
        return 1;
    }
    async getCompletedItems() {
        const allItems = await this.findAllWithRatings();
        return allItems.filter(item => item.isCompleted);
    }
    async getIncompleteItems() {
        const allItems = await this.findAllWithRatings();
        return allItems.filter(item => !item.isCompleted);
    }
    async getBaekRatedItems() {
        const allItems = await this.findAllWithRatings();
        return allItems.filter(item => item.baekRating !== undefined);
    }
    async getJeongRatedItems() {
        const allItems = await this.findAllWithRatings();
        return allItems.filter(item => item.jeongRating !== undefined);
    }
    async getItemsSortedByRating(order = 'desc') {
        const allItems = await this.findAllWithRatings();
        return allItems
            .filter(item => item.averageRating !== undefined)
            .sort((a, b) => {
            const aRating = a.averageRating || 0;
            const bRating = b.averageRating || 0;
            return order === 'desc' ? bRating - aRating : aRating - bRating;
        });
    }
};
exports.FoodItemService = FoodItemService;
exports.FoodItemService = FoodItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(food_item_entity_1.FoodItem)),
    __param(1, (0, typeorm_1.InjectRepository)(food_rating_entity_1.FoodRating)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FoodItemService);
//# sourceMappingURL=food-item.service.js.map