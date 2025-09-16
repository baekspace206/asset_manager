import { Repository } from 'typeorm';
import { PortfolioSnapshot } from './entities/portfolio-snapshot.entity';
import { Asset } from '../assets/entities/asset.entity';
export declare class PortfolioService {
    private portfolioSnapshotRepository;
    private assetRepository;
    constructor(portfolioSnapshotRepository: Repository<PortfolioSnapshot>, assetRepository: Repository<Asset>);
    createSnapshot(): Promise<PortfolioSnapshot>;
    getSnapshots(): Promise<PortfolioSnapshot[]>;
    getGrowthData(startDate?: string, endDate?: string): Promise<{
        date: string;
        value: number;
    }[]>;
}
