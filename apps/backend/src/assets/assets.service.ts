import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AuditService } from '../audit/audit.service';
import { PortfolioService } from '../portfolio/portfolio.service';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset) private repo: Repository<Asset>,
    private auditService: AuditService,
    private portfolioService: PortfolioService,
  ) {}

  async create(dto: CreateAssetDto) {
    const asset = this.repo.create(dto);
    const savedAsset = await this.repo.save(asset);
    
    // Log audit
    await this.auditService.logAction(
      'CREATE',
      'Asset',
      savedAsset.id,
      savedAsset.name,
      null,
      savedAsset
    );
    
    // Create portfolio snapshot
    await this.portfolioService.createSnapshot();
    
    return savedAsset;
  }

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const asset = await this.repo.findOne({ where: { id } });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async update(id: number, dto: UpdateAssetDto) {
    const oldAsset = await this.findOne(id);
    await this.repo.update(id, dto);
    const newAsset = await this.findOne(id);
    
    // Log audit
    await this.auditService.logAction(
      'UPDATE',
      'Asset',
      newAsset.id,
      newAsset.name,
      oldAsset,
      newAsset
    );
    
    // Create portfolio snapshot
    await this.portfolioService.createSnapshot();
    
    return newAsset;
  }

  async remove(id: number) {
    const asset = await this.findOne(id);
    await this.repo.delete(id);
    
    // Log audit
    await this.auditService.logAction(
      'DELETE',
      'Asset',
      asset.id,
      asset.name,
      asset,
      null
    );
    
    // Create portfolio snapshot
    await this.portfolioService.createSnapshot();
    
    return { success: true };
  }
}