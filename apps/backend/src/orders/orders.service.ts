import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { FoodRank } from './entities/food-rank.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, CompleteOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(FoodRank)
    private foodRankRepository: Repository<FoodRank>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number): Promise<Order> {
    const order = this.ordersRepository.create({
      ...createOrderDto,
      userId,
      status: OrderStatus.PENDING,
    });
    return this.ordersRepository.save(order);
  }

  async findAllPending(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { status: OrderStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllCompleted(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { status: OrderStatus.COMPLETED },
      order: { completedAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto, userId: number): Promise<Order> {
    const order = await this.findOne(id, userId);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  async complete(id: number, completeOrderDto: CompleteOrderDto, userId: number): Promise<Order> {
    const order = await this.findOne(id, userId);
    
    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Order is not in pending status');
    }

    // Update order
    order.status = OrderStatus.COMPLETED;
    order.completedImage = completeOrderDto.completedImage || null;
    order.completedComment = completeOrderDto.completedComment || null;
    order.completedAt = new Date();

    const completedOrder = await this.ordersRepository.save(order);

    // Create food rank entry
    const foodRank = this.foodRankRepository.create({
      orderId: order.id,
      userId,
      foodType: order.foodType,
      restaurantName: completeOrderDto.restaurantName,
      foodImage: completeOrderDto.foodImage,
      rating: completeOrderDto.rating,
      date: new Date(order.date),
      comment: completeOrderDto.rankComment || null,
    });

    await this.foodRankRepository.save(foodRank);

    return completedOrder;
  }

  async remove(id: number, userId: number): Promise<{ success: boolean }> {
    const order = await this.findOne(id, userId);
    await this.ordersRepository.remove(order);
    return { success: true };
  }
}