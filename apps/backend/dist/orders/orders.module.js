"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const food_rank_controller_1 = require("./food-rank.controller");
const food_rank_service_1 = require("./food-rank.service");
const food_item_controller_1 = require("./food-item.controller");
const food_item_service_1 = require("./food-item.service");
const order_entity_1 = require("./entities/order.entity");
const food_rank_entity_1 = require("./entities/food-rank.entity");
const food_item_entity_1 = require("./entities/food-item.entity");
const food_rating_entity_1 = require("./entities/food-rating.entity");
const user_entity_1 = require("../users/entities/user.entity");
const users_module_1 = require("../users/users.module");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, food_rank_entity_1.FoodRank, food_item_entity_1.FoodItem, food_rating_entity_1.FoodRating, user_entity_1.User]),
            users_module_1.UsersModule
        ],
        controllers: [orders_controller_1.OrdersController, food_rank_controller_1.FoodRankController, food_item_controller_1.FoodItemController],
        providers: [orders_service_1.OrdersService, food_rank_service_1.FoodRankService, food_item_service_1.FoodItemService],
        exports: [orders_service_1.OrdersService, food_rank_service_1.FoodRankService, food_item_service_1.FoodItemService]
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map