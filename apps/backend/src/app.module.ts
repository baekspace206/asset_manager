import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetsModule } from './assets/assets.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AuditModule } from './audit/audit.module';
import { LedgerModule } from './ledger/ledger.module';
import { OrdersModule } from './orders/orders.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'asset.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AssetsModule,
    AuthModule,
    UsersModule,
    PortfolioModule,
    AuditModule,
    LedgerModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}