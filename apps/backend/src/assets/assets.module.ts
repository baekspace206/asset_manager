import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Asset } from './entities/asset.entity';
import { AuditModule } from '../audit/audit.module';
import { PortfolioModule } from '../portfolio/portfolio.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset]),
    AuditModule,
    PortfolioModule,
    UsersModule,
  ],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}