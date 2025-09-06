import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { FoodRankController } from './food-rank.controller';
import { FoodRankService } from './food-rank.service';
import { Order } from './entities/order.entity';
import { FoodRank } from './entities/food-rank.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, FoodRank]),
    UsersModule
  ],
  controllers: [OrdersController, FoodRankController],
  providers: [OrdersService, FoodRankService],
  exports: [OrdersService, FoodRankService]
})
export class OrdersModule {}