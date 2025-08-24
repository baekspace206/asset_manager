import { Controller, Get, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('snapshot')
  async createSnapshot() {
    return this.portfolioService.createSnapshot();
  }

  @Get('growth')
  async getGrowthData() {
    return this.portfolioService.getGrowthData();
  }
}