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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const food_item_entity_1 = require("./entities/food-item.entity");
const food_rating_entity_1 = require("./entities/food-rating.entity");
let OrdersService = class OrdersService {
    ordersRepository;
    foodItemRepository;
    foodRatingRepository;
    constructor(ordersRepository, foodItemRepository, foodRatingRepository) {
        this.ordersRepository = ordersRepository;
        this.foodItemRepository = foodItemRepository;
        this.foodRatingRepository = foodRatingRepository;
    }
    async create(createOrderDto, userId) {
        const order = this.ordersRepository.create({
            ...createOrderDto,
            userId,
            status: order_entity_1.OrderStatus.PENDING,
        });
        return this.ordersRepository.save(order);
    }
    async findAllPending(userId) {
        return this.ordersRepository.find({
            where: { status: order_entity_1.OrderStatus.PENDING },
            order: { createdAt: 'DESC' },
        });
    }
    async findAllCompleted(userId) {
        return this.ordersRepository.find({
            where: { status: order_entity_1.OrderStatus.COMPLETED },
            order: { completedAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const order = await this.ordersRepository.findOne({
            where: { id },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async update(id, updateOrderDto, userId) {
        const order = await this.findOne(id, userId);
        Object.assign(order, updateOrderDto);
        return this.ordersRepository.save(order);
    }
    async complete(id, completeOrderDto, userId) {
        const order = await this.findOne(id, userId);
        if (order.status !== order_entity_1.OrderStatus.PENDING) {
            throw new Error('Order is not in pending status');
        }
        order.status = order_entity_1.OrderStatus.COMPLETED;
        order.completedImage = completeOrderDto.completedImage || null;
        order.completedComment = completeOrderDto.completedComment || null;
        order.completedAt = new Date();
        const completedOrder = await this.ordersRepository.save(order);
        let foodItem = await this.foodItemRepository.findOne({
            where: {
                orderId: order.id
            }
        });
        if (!foodItem) {
            foodItem = this.foodItemRepository.create({
                orderId: order.id,
                foodType: order.foodType,
                restaurantName: completeOrderDto.restaurantName,
                foodImage: completeOrderDto.foodImage,
                date: new Date(order.date),
                description: order.details,
                createdBy: userId,
            });
            foodItem = await this.foodItemRepository.save(foodItem);
        }
        const existingRating = await this.foodRatingRepository.findOne({
            where: { foodItemId: foodItem.id, userId }
        });
        if (!existingRating) {
            const rating = this.foodRatingRepository.create({
                foodItemId: foodItem.id,
                userId,
                rating: completeOrderDto.rating,
                comment: completeOrderDto.rankComment || null,
            });
            await this.foodRatingRepository.save(rating);
        }
        return completedOrder;
    }
    async remove(id, userId) {
        const order = await this.findOne(id, userId);
        await this.ordersRepository.remove(order);
        return { success: true };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(food_item_entity_1.FoodItem)),
    __param(2, (0, typeorm_1.InjectRepository)(food_rating_entity_1.FoodRating)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map