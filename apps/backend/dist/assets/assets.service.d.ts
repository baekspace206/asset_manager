import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AuditService } from '../audit/audit.service';
import { PortfolioService } from '../portfolio/portfolio.service';
export declare class AssetsService {
    private repo;
    private auditService;
    private portfolioService;
    constructor(repo: Repository<Asset>, auditService: AuditService, portfolioService: PortfolioService);
    create(dto: CreateAssetDto): Promise<Asset>;
    findAll(): Promise<Asset[]>;
    findOne(id: number): Promise<Asset>;
    update(id: number, dto: UpdateAssetDto): Promise<Asset>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
