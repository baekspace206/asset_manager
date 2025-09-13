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

  async getGrowthData(startDate?: string, endDate?: string): Promise<{ date: string; value: number }[]> {
    let snapshots = await this.getSnapshots();
    
    // Filter by date range if provided
    if (startDate) {
      snapshots = snapshots.filter(snapshot => 
        snapshot.date >= new Date(startDate)
      );
    }
    if (endDate) {
      snapshots = snapshots.filter(snapshot => 
        snapshot.date <= new Date(endDate + 'T23:59:59.999Z')
      );
    }
    
    // Group by date (YYYY-MM-DD) and aggregate values
    const dailyData = new Map<string, { value: number; timestamp: Date }[]>();
    
    snapshots.forEach(snapshot => {
      const dateKey = snapshot.date.toISOString().split('T')[0];
      const value = parseFloat(snapshot.totalValue.toString());
      
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, []);
      }
      dailyData.get(dateKey)!.push({ value, timestamp: snapshot.date });
    });
    
    // Convert to array and use the latest (chronologically last) value for each day
    const result = Array.from(dailyData.entries())
      .map(([date, entries]) => {
        // Sort by timestamp to get the chronologically latest entry
        const sortedEntries = entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        return {
          date,
          value: sortedEntries[0].value // Take the chronologically latest value
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return result;
  }
}