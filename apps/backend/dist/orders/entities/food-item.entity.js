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
exports.FoodItem = void 0;
const typeorm_1 = require("typeorm");
const food_rating_entity_1 = require("./food-rating.entity");
let FoodItem = class FoodItem {
    id;
    orderId;
    foodType;
    restaurantName;
    foodImage;
    date;
    description;
    createdBy;
    ratings;
    createdAt;
    updatedAt;
};
exports.FoodItem = FoodItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FoodItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], FoodItem.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FoodItem.prototype, "foodType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], FoodItem.prototype, "restaurantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], FoodItem.prototype, "foodImage", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], FoodItem.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], FoodItem.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], FoodItem.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => food_rating_entity_1.FoodRating, rating => rating.foodItem),
    __metadata("design:type", Array)
], FoodItem.prototype, "ratings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FoodItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FoodItem.prototype, "updatedAt", void 0);
exports.FoodItem = FoodItem = __decorate([
    (0, typeorm_1.Entity)()
], FoodItem);
//# sourceMappingURL=food-item.entity.js.map