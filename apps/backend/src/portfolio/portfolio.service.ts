import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioSnapshot } from './entities/portfolio-snapshot.entity';
import { Asset } from '../assets/entities/asset.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(PortfolioSnapshot)
    private portfolioSnapshotRepository: Repository<PortfolioSnapshot>,
    @InjectRepository(Asset)
    private assetRepository: Repository<Asset>,
  ) {}

  async createSnapshot(): Promise<PortfolioSnapshot> {
    const assets = await this.assetRepository.find();
    const totalValue = assets.reduce((sum, asset) => sum + Number(asset.amount), 0);

    const snapshot = this.portfolioSnapshotRepository.create({
      totalValue,
    });

    return this.portfolioSnapshotRepository.save(snapshot);
  }

  async getSnapshots(): Promise<PortfolioSnapshot[]> {
    return this.portfolioSnapshotRepository.find({
      order: { date: 'ASC' },
    });
  }

  async getGrowthData(): Promise<{ date: string; value: number }[]> {
    const snapshots = await this.getSnapshots();
    return snapshots.map(snapshot => ({
      date: snapshot.date.toISOString().split('T')[0],
      value: Number(snapshot.totalValue)
    }));
  }
}