"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const asset_entity_1 = require("./entities/asset.entity");
const audit_service_1 = require("../audit/audit.service");
const portfolio_service_1 = require("../portfolio/portfolio.service");
let AssetsService = class AssetsService {
    repo;
    auditService;
    portfolioService;
    constructor(repo, auditService, portfolioService) {
        this.repo = repo;
        this.auditService = auditService;
        this.portfolioService = portfolioService;
    }
    async create(dto) {
        const previousAssets = await this.findAll();
        const previousTotal = previousAssets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        const asset = this.repo.create(dto);
        const savedAsset = await this.repo.save(asset);
        const currentAssets = await this.findAll();
        const currentTotal = currentAssets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        await this.auditService.logAction('CREATE', 'Asset', savedAsset.id, savedAsset.name, null, savedAsset, previousTotal, currentTotal);
        await this.portfolioService.createSnapshot();
        return savedAsset;
    }
    findAll() {
        return this.repo.find({ order: { id: 'DESC' } });
    }
    async findOne(id) {
        const asset = await this.repo.findOne({ where: { id } });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        return asset;
    }
    async update(id, dto) {
        const previousAssets = await this.findAll();
        const previousTotal = previousAssets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        const oldAsset = await this.findOne(id);
        await this.repo.update(id, dto);
        const newAsset = await this.findOne(id);
        const currentAssets = await this.findAll();
        const currentTotal = currentAssets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        await this.auditService.logAction('UPDATE', 'Asset', newAsset.id, newAsset.name, oldAsset, newAsset, previousTotal, currentTotal);
        await this.portfolioService.createSnapshot();
        return newAsset;
    }
    async remove(id) {
        const previousAssets = await this.findAll();
        const previousTotal = previousAssets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        const asset = await this.findOne(id);
        await this.repo.delete(id);
        const currentAssets = await this.findAll();
        const currentTotal = currentAssets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        await this.auditService.logAction('DELETE', 'Asset', asset.id, asset.name, asset, null, previousTotal, currentTotal);
        await this.portfolioService.createSnapshot();
        return { success: true };
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService,
        portfolio_service_1.PortfolioService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map