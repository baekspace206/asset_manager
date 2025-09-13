import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, CompleteOrderDto } from './dto/update-order.dto';
import { UsersService } from '../users/users.service';
export declare class OrdersController {
    private readonly ordersService;
    private readonly usersService;
    constructor(ordersService: OrdersService, usersService: UsersService);
    create(createOrderDto: CreateOrderDto, req: any): Promise<import("./entities/order.entity").Order>;
    findAllPending(req: any): Promise<import("./entities/order.entity").Order[]>;
    findAllCompleted(req: any): Promise<import("./entities/order.entity").Order[]>;
    findOne(id: string, req: any): Promise<import("./entities/order.entity").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto, req: any): Promise<import("./entities/order.entity").Order>;
    complete(id: string, completeOrderDto: CompleteOrderDto, req: any): Promise<import("./entities/order.entity").Order>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
