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
exports.FoodRankService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const food_rank_entity_1 = require("./entities/food-rank.entity");
let FoodRankService = class FoodRankService {
    foodRankRepository;
    constructor(foodRankRepository) {
        this.foodRankRepository = foodRankRepository;
    }
    async create(createFoodRankDto, userId) {
        const foodRank = this.foodRankRepository.create({
            ...createFoodRankDto,
            userId,
            date: new Date(createFoodRankDto.date),
            orderId: createFoodRankDto.orderId || undefined,
        });
        return this.foodRankRepository.save(foodRank);
    }
    async findAll(userId) {
        return this.foodRankRepository.find({
            order: { date: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const foodRank = await this.foodRankRepository.findOne({
            where: { id },
        });
        if (!foodRank) {
            throw new common_1.NotFoundException('Food rank not found');
        }
        return foodRank;
    }
    async update(id, updateFoodRankDto, userId) {
        const foodRank = await this.findOne(id, userId);
        if (updateFoodRankDto.date) {
            updateFoodRankDto.date = new Date(updateFoodRankDto.date).toISOString();
        }
        Object.assign(foodRank, updateFoodRankDto);
        return this.foodRankRepository.save(foodRank);
    }
    async remove(id, userId) {
        const foodRank = await this.findOne(id, userId);
        await this.foodRankRepository.remove(foodRank);
        return { success: true };
    }
    async findByOrderId(orderId, userId) {
        return this.foodRankRepository.findOne({
            where: { orderId, userId },
        });
    }
};
exports.FoodRankService = FoodRankService;
exports.FoodRankService = FoodRankService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(food_rank_entity_1.FoodRank)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FoodRankService);
//# sourceMappingURL=food-rank.service.js.map