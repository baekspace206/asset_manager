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
exports.AssetsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const assets_service_1 = require("./assets.service");
const create_asset_dto_1 = require("./dto/create-asset.dto");
const update_asset_dto_1 = require("./dto/update-asset.dto");
const users_service_1 = require("../users/users.service");
let AssetsController = class AssetsController {
    assetsService;
    usersService;
    constructor(assetsService, usersService) {
        this.assetsService = assetsService;
        this.usersService = usersService;
    }
    async create(createAssetDto, req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user || !await this.usersService.hasEditPermission(user)) {
            throw new common_1.ForbiddenException('Edit permission required');
        }
        return this.assetsService.create(createAssetDto);
    }
    findAll() {
        return this.assetsService.findAll();
    }
    findOne(id) {
        return this.assetsService.findOne(+id);
    }
    async update(id, updateAssetDto, req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user || !await this.usersService.hasEditPermission(user)) {
            throw new common_1.ForbiddenException('Edit permission required');
        }
        return this.assetsService.update(+id, updateAssetDto);
    }
    async remove(id, req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user || !await this.usersService.hasEditPermission(user)) {
            throw new common_1.ForbiddenException('Edit permission required');
        }
        return this.assetsService.remove(+id);
    }
};
exports.AssetsController = AssetsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_asset_dto_1.CreateAssetDto, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_asset_dto_1.UpdateAssetDto, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AssetsController.prototype, "remove", null);
exports.AssetsController = AssetsController = __decorate([
    (0, common_1.Controller)('assets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [assets_service_1.AssetsService,
        users_service_1.UsersService])
], AssetsController);
//# sourceMappingURL=assets.controller.js.map