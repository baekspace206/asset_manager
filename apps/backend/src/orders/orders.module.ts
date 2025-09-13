import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { FoodRankController } from './food-rank.controller';
import { FoodRankService } from './food-rank.service';
import { FoodItemController } from './food-item.controller';
import { FoodItemService } from './food-item.service';
import { Order } from './entities/order.entity';
import { FoodRank } from './entities/food-rank.entity';
import { FoodItem } from './entities/food-item.entity';
import { FoodRating } from './entities/food-rating.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, FoodRank, FoodItem, FoodRating]),
    UsersModule
  ],
  controllers: [OrdersController, FoodRankController, FoodItemController],
  providers: [OrdersService, FoodRankService, FoodItemService],
  exports: [OrdersService, FoodRankService, FoodItemService]
})
export class OrdersModule {}