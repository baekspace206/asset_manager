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
exports.LedgerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ledger_entry_entity_1 = require("./entities/ledger-entry.entity");
const ledger_log_entity_1 = require("./entities/ledger-log.entity");
let LedgerService = class LedgerService {
    ledgerRepository;
    ledgerLogRepository;
    constructor(ledgerRepository, ledgerLogRepository) {
        this.ledgerRepository = ledgerRepository;
        this.ledgerLogRepository = ledgerLogRepository;
    }
    async create(createLedgerEntryDto, userId, username) {
        const entry = this.ledgerRepository.create({
            ...createLedgerEntryDto,
            userId,
        });
        const savedEntry = await this.ledgerRepository.save(entry);
        await this.createLogEntry(savedEntry, userId, username, ledger_log_entity_1.LedgerLogAction.CREATE);
        return savedEntry;
    }
    async findAll(userId) {
        return this.ledgerRepository.find({
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const entry = await this.ledgerRepository.findOne({
            where: { id },
        });
        if (!entry) {
            throw new common_1.NotFoundException('Ledger entry not found');
        }
        return entry;
    }
    async update(id, updateLedgerEntryDto, userId, username) {
        const entry = await this.findOne(id, userId);
        const previousData = JSON.stringify({
            description: entry.description,
            amount: entry.amount,
            category: entry.category,
            date: entry.date,
            note: entry.note
        });
        Object.assign(entry, updateLedgerEntryDto);
        const updatedEntry = await this.ledgerRepository.save(entry);
        await this.createLogEntry(updatedEntry, userId, username, ledger_log_entity_1.LedgerLogAction.UPDATE, previousData);
        return updatedEntry;
    }
    async remove(id, userId, username) {
        const entry = await this.findOne(id, userId);
        await this.createLogEntry(entry, userId, username, ledger_log_entity_1.LedgerLogAction.DELETE);
        await this.ledgerRepository.remove(entry);
        return { success: true };
    }
    async getMonthlyStats(userId, year, month) {
        let entries = [];
        try {
            if (year && month) {
                const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
                const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
                entries = await this.ledgerRepository.find({
                    where: {
                        date: (0, typeorm_2.Between)(startDate, endDate)
                    },
                    order: { date: 'DESC', createdAt: 'DESC' }
                });
            }
            else if (year) {
                const startDate = `${year}-01-01`;
                const endDate = `${year}-12-31`;
                entries = await this.ledgerRepository.find({
                    where: {
                        date: (0, typeorm_2.Between)(startDate, endDate)
                    },
                    order: { date: 'DESC', createdAt: 'DESC' }
                });
            }
            else {
                entries = await this.ledgerRepository.find({
                    order: { date: 'DESC', createdAt: 'DESC' }
                });
            }
        }
        catch (error) {
            console.error('Error fetching monthly stats:', error);
            return [];
        }
        const monthlyData = {};
        entries.forEach(entry => {
            const date = new Date(entry.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthKey,
                    categories: {},
                    totalAmount: 0,
                };
            }
            if (!monthlyData[monthKey].categories[entry.category]) {
                monthlyData[monthKey].categories[entry.category] = {
                    total: 0,
                    count: 0,
                    entries: [],
                };
            }
            monthlyData[monthKey].categories[entry.category].total += entry.amount;
            monthlyData[monthKey].categories[entry.category].count += 1;
            monthlyData[monthKey].categories[entry.category].entries.push(entry);
            monthlyData[monthKey].totalAmount += entry.amount;
        });
        return Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));
    }
    async getCategories(userId) {
        if (!userId || isNaN(Number(userId))) {
            console.error('Invalid userId provided to getCategories:', userId);
            return [];
        }
        try {
            const result = await this.ledgerRepository
                .createQueryBuilder('entry')
                .select('DISTINCT entry.category', 'category')
                .getRawMany();
            return result.map(item => item.category).sort();
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
    async createLogEntry(entry, userId, username, action, previousData) {
        const logEntry = this.ledgerLogRepository.create({
            entryId: entry.id,
            userId,
            username,
            action,
            description: entry.description,
            amount: entry.amount,
            category: entry.category,
            date: entry.date instanceof Date ? entry.date.toISOString().split('T')[0] : String(entry.date),
            note: entry.note || '',
            previousData
        });
        await this.ledgerLogRepository.save(logEntry);
    }
    async getLogs(userId, limit = 50) {
        try {
            return await this.ledgerLogRepository.find({
                order: { createdAt: 'DESC' },
                take: limit
            });
        }
        catch (error) {
            console.error('Error fetching ledger logs:', error);
            return [];
        }
    }
};
exports.LedgerService = LedgerService;
exports.LedgerService = LedgerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ledger_entry_entity_1.LedgerEntry)),
    __param(1, (0, typeorm_1.InjectRepository)(ledger_log_entity_1.LedgerLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LedgerService);
//# sourceMappingURL=ledger.service.js.map