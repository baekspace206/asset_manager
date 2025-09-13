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
exports.LedgerController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const ledger_service_1 = require("./ledger.service");
const create_ledger_entry_dto_1 = require("./dto/create-ledger-entry.dto");
const update_ledger_entry_dto_1 = require("./dto/update-ledger-entry.dto");
const users_service_1 = require("../users/users.service");
let LedgerController = class LedgerController {
    ledgerService;
    usersService;
    constructor(ledgerService, usersService) {
        this.ledgerService = ledgerService;
        this.usersService = usersService;
    }
    async create(createLedgerEntryDto, req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user || !await this.usersService.hasEditPermission(user)) {
            throw new common_1.ForbiddenException('Edit permission required');
        }
        return this.ledgerService.create(createLedgerEntryDto, req.user.userId, user.username);
    }
    findAll(req) {
        return this.ledgerService.findAll(req.user.userId);
    }
    getMonthlyStats(req, year, month) {
        const yearNum = year ? parseInt(year) : undefined;
        const monthNum = month ? parseInt(month) : undefined;
        return this.ledgerService.getMonthlyStats(req.user.userId, yearNum, monthNum);
    }
    getCategories(req) {
        return this.ledgerService.getCategories(req.user.userId);
    }
    getLogs(req, limit) {
        const limitNum = limit ? parseInt(limit) : 50;
        return this.ledgerService.getLogs(req.user.userId, limitNum);
    }
    findOne(id, req) {
        return this.ledgerService.findOne(+id, req.user.userId);
    }
    async update(id, updateLedgerEntryDto, req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user || !await this.usersService.hasEditPermission(user)) {
            throw new common_1.ForbiddenException('Edit permission required');
        }
        return this.ledgerService.update(+id, updateLedgerEntryDto, req.user.userId, user.username);
    }
    async remove(id, req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user || !await this.usersService.hasEditPermission(user)) {
            throw new common_1.ForbiddenException('Edit permission required');
        }
        return this.ledgerService.remove(+id, req.user.userId, user.username);
    }
};
exports.LedgerController = LedgerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ledger_entry_dto_1.CreateLedgerEntryDto, Object]),
    __metadata("design:returntype", Promise)
], LedgerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getMonthlyStats", null);
__decorate([
    (0, common_1.Get)('categories'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('logs'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LedgerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ledger_entry_dto_1.UpdateLedgerEntryDto, Object]),
    __metadata("design:returntype", Promise)
], LedgerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LedgerController.prototype, "remove", null);
exports.LedgerController = LedgerController = __decorate([
    (0, common_1.Controller)('ledger'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ledger_service_1.LedgerService,
        users_service_1.UsersService])
], LedgerController);
//# sourceMappingURL=ledger.controller.js.map