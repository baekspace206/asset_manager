import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { FoodItem } from './entities/food-item.entity';
import { FoodRating } from './entities/food-rating.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, CompleteOrderDto } from './dto/update-order.dto';
export declare class OrdersService {
    private ordersRepository;
    private foodItemRepository;
    private foodRatingRepository;
    constructor(ordersRepository: Repository<Order>, foodItemRepository: Repository<FoodItem>, foodRatingRepository: Repository<FoodRating>);
    create(createOrderDto: CreateOrderDto, userId: number): Promise<Order>;
    findAllPending(userId: number): Promise<Order[]>;
    findAllCompleted(userId: number): Promise<Order[]>;
    findOne(id: number, userId: number): Promise<Order>;
    update(id: number, updateOrderDto: UpdateOrderDto, userId: number): Promise<Order>;
    complete(id: number, completeOrderDto: CompleteOrderDto, userId: number): Promise<Order>;
    remove(id: number, userId: number): Promise<{
        success: boolean;
    }>;
}
