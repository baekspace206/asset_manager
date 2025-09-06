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
import { FoodRankService } from './food-rank.service';
import { CreateFoodRankDto } from './dto/create-food-rank.dto';
import { UpdateFoodRankDto } from './dto/update-food-rank.dto';
import { UsersService } from '../users/users.service';

@Controller('food-ranks')
@UseGuards(JwtAuthGuard)
export class FoodRankController {
  constructor(
    private readonly foodRankService: FoodRankService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createFoodRankDto: CreateFoodRankDto, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.foodRankService.create(createFoodRankDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.foodRankService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.foodRankService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateFoodRankDto: UpdateFoodRankDto, 
    @Request() req
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.foodRankService.update(+id, updateFoodRankDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.foodRankService.remove(+id, req.user.userId);
  }
}