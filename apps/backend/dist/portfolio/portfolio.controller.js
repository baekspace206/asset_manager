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
exports.PortfolioController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const portfolio_service_1 = require("./portfolio.service");
const users_service_1 = require("../users/users.service");
let PortfolioController = class PortfolioController {
    portfolioService;
    usersService;
    constructor(portfolioService, usersService) {
        this.portfolioService = portfolioService;
        this.usersService = usersService;
    }
    async createSnapshot(req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user || !await this.usersService.hasEditPermission(user)) {
            throw new common_1.ForbiddenException('Edit permission required');
        }
        return this.portfolioService.createSnapshot();
    }
    async getGrowthData(startDate, endDate) {
        return this.portfolioService.getGrowthData(startDate, endDate);
    }
};
exports.PortfolioController = PortfolioController;
__decorate([
    (0, common_1.Post)('snapshot'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "createSnapshot", null);
__decorate([
    (0, common_1.Get)('growth'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PortfolioController.prototype, "getGrowthData", null);
exports.PortfolioController = PortfolioController = __decorate([
    (0, common_1.Controller)('portfolio'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [portfolio_service_1.PortfolioService,
        users_service_1.UsersService])
], PortfolioController);
//# sourceMappingURL=portfolio.controller.js.map