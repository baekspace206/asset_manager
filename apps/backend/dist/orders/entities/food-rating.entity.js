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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodRating = void 0;
const typeorm_1 = require("typeorm");
const food_item_entity_1 = require("./food-item.entity");
let FoodRating = class FoodRating {
    id;
    foodItemId;
    userId;
    rating;
    comment;
    foodItem;
    createdAt;
    updatedAt;
};
exports.FoodRating = FoodRating;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FoodRating.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FoodRating.prototype, "foodItemId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FoodRating.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 5 }),
    __metadata("design:type", Number)
], FoodRating.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], FoodRating.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => food_item_entity_1.FoodItem, foodItem => foodItem.ratings),
    (0, typeorm_1.JoinColumn)({ name: 'foodItemId' }),
    __metadata("design:type", food_item_entity_1.FoodItem)
], FoodRating.prototype, "foodItem", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FoodRating.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FoodRating.prototype, "updatedAt", void 0);
exports.FoodRating = FoodRating = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['foodItemId', 'userId'])
], FoodRating);
//# sourceMappingURL=food-rating.entity.js.map