import { Controller, Get, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PortfolioService } from './portfolio.service';
import { UsersService } from '../users/users.service';

@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly usersService: UsersService
  ) {}

  @Post('snapshot')
  async createSnapshot(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.portfolioService.createSnapshot();
  }

  @Get('growth')
  async getGrowthData() {
    return this.portfolioService.getGrowthData();
  }
}