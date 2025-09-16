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
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const portfolio_snapshot_entity_1 = require("./entities/portfolio-snapshot.entity");
const asset_entity_1 = require("../assets/entities/asset.entity");
let PortfolioService = class PortfolioService {
    portfolioSnapshotRepository;
    assetRepository;
    constructor(portfolioSnapshotRepository, assetRepository) {
        this.portfolioSnapshotRepository = portfolioSnapshotRepository;
        this.assetRepository = assetRepository;
    }
    async createSnapshot() {
        const assets = await this.assetRepository.find();
        const totalValue = assets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        const snapshot = this.portfolioSnapshotRepository.create({
            totalValue,
        });
        return this.portfolioSnapshotRepository.save(snapshot);
    }
    async getSnapshots() {
        return this.portfolioSnapshotRepository.find({
            order: { date: 'ASC' },
        });
    }
    async getGrowthData(startDate, endDate) {
        let snapshots = await this.getSnapshots();
        if (startDate) {
            snapshots = snapshots.filter(snapshot => snapshot.date >= new Date(startDate));
        }
        if (endDate) {
            snapshots = snapshots.filter(snapshot => snapshot.date <= new Date(endDate + 'T23:59:59.999Z'));
        }
        const dailyData = new Map();
        snapshots.forEach(snapshot => {
            const dateKey = snapshot.date.toISOString().split('T')[0];
            const value = parseFloat(snapshot.totalValue.toString());
            if (!dailyData.has(dateKey)) {
                dailyData.set(dateKey, []);
            }
            dailyData.get(dateKey).push({ value, timestamp: snapshot.date });
        });
        const result = Array.from(dailyData.entries())
            .map(([date, entries]) => {
            const sortedEntries = entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            return {
                date,
                value: sortedEntries[0].value
            };
        })
            .sort((a, b) => a.date.localeCompare(b.date));
        return result;
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(portfolio_snapshot_entity_1.PortfolioSnapshot)),
    __param(1, (0, typeorm_1.InjectRepository)(asset_entity_1.Asset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map