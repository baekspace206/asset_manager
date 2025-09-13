import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { FoodItemService } from './food-item.service';
import { CreateFoodItemDto } from './dto/create-food-item.dto';
import { CreateFoodRatingDto } from './dto/create-food-rating.dto';
import { UpdateFoodRatingDto } from './dto/update-food-rating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('food-items')
@UseGuards(JwtAuthGuard)
export class FoodItemController {
  constructor(
    private readonly foodItemService: FoodItemService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() createFoodItemDto: CreateFoodItemDto, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.foodItemService.create(createFoodItemDto, req.user.userId);
  }

  @Get()
  async findAll(@Query('filter') filter?: string, @Query('sort') sort?: string) {
    switch (filter) {
      case 'completed':
        return this.foodItemService.getCompletedItems();
      case 'incomplete':
        return this.foodItemService.getIncompleteItems();
      case 'baek-rated':
        return this.foodItemService.getBaekRatedItems();
      case 'jeong-rated':
        return this.foodItemService.getJeongRatedItems();
      default:
        if (sort === 'rating-desc' || sort === 'rating-asc') {
          const order = sort === 'rating-desc' ? 'desc' : 'asc';
          return this.foodItemService.getItemsSortedByRating(order);
        }
        return this.foodItemService.findAllWithRatings();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foodItemService.findOne(+id);
  }

  @Post(':id/ratings')
  async addRating(
    @Param('id') id: string,
    @Body() createRatingDto: CreateFoodRatingDto,
    @Request() req
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    
    createRatingDto.foodItemId = +id;
    return this.foodItemService.addRating(createRatingDto, req.user.userId);
  }

  @Patch(':id/ratings')
  async updateRating(
    @Param('id') id: string,
    @Body() updateRatingDto: UpdateFoodRatingDto,
    @Request() req
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    
    return this.foodItemService.updateRating(+id, updateRatingDto, req.user.userId);
  }

  @Delete(':id/ratings')
  async deleteRating(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    
    return this.foodItemService.deleteRating(+id, req.user.userId);
  }

  @Delete(':id')
  async deleteFoodItem(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    
    return this.foodItemService.deleteFoodItem(+id, req.user.userId);
  }
}