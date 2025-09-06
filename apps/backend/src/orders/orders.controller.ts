import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  ForbiddenException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, CompleteOrderDto } from './dto/update-order.dto';
import { UsersService } from '../users/users.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get('pending')
  findAllPending(@Request() req) {
    return this.ordersService.findAllPending(req.user.userId);
  }

  @Get('completed')
  findAllCompleted(@Request() req) {
    return this.ordersService.findAllCompleted(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateOrderDto: UpdateOrderDto, 
    @Request() req
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.ordersService.update(+id, updateOrderDto, req.user.userId);
  }

  @Post(':id/complete')
  async complete(
    @Param('id') id: string,
    @Body() completeOrderDto: CompleteOrderDto,
    @Request() req
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.ordersService.complete(+id, completeOrderDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.ordersService.remove(+id, req.user.userId);
  }
}