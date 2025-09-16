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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(req) {
        const user = await this.usersService.findById(req.user.userId);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getPendingUsers(req) {
        const admin = await this.usersService.findById(req.user.userId);
        if (!admin || !await this.usersService.isAdmin(admin)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        return this.usersService.getPendingUsers();
    }
    async getAllUsers(req) {
        const admin = await this.usersService.findById(req.user.userId);
        if (!admin || !await this.usersService.isAdmin(admin)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        const users = await this.usersService.getAllUsers();
        return users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }
    async approveUser(userId, body, req) {
        const admin = await this.usersService.findById(req.user.userId);
        if (!admin || !await this.usersService.isAdmin(admin)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        const approvedUser = await this.usersService.approveUser(userId, admin.username, body.permission);
        const { password, ...userWithoutPassword } = approvedUser;
        return userWithoutPassword;
    }
    async rejectUser(userId, body, req) {
        const admin = await this.usersService.findById(req.user.userId);
        if (!admin || !await this.usersService.isAdmin(admin)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        const rejectedUser = await this.usersService.rejectUser(userId, admin.username, body.reason);
        const { password, ...userWithoutPassword } = rejectedUser;
        return userWithoutPassword;
    }
    async updateUserPermission(userId, body, req) {
        const admin = await this.usersService.findById(req.user.userId);
        if (!admin || !await this.usersService.isAdmin(admin)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        const updatedUser = await this.usersService.updateUserPermission(userId, body.permission, admin.username);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async changePassword(body, req) {
        if (!body.oldPassword || !body.newPassword) {
            throw new common_1.BadRequestException('Both old and new passwords are required');
        }
        if (body.newPassword.length < 6) {
            throw new common_1.BadRequestException('New password must be at least 6 characters long');
        }
        await this.usersService.changePassword(req.user.userId, body.oldPassword, body.newPassword);
        return { message: 'Password changed successfully' };
    }
    async getAdminStats(req) {
        const admin = await this.usersService.findById(req.user.userId);
        if (!admin || !await this.usersService.isAdmin(admin)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        const allUsers = await this.usersService.getAllUsers();
        const pendingUsers = await this.usersService.getPendingUsers();
        const stats = {
            totalUsers: allUsers.length,
            pendingUsers: pendingUsers.length,
            approvedUsers: allUsers.filter(user => user.status === 'approved').length,
            rejectedUsers: allUsers.filter(user => user.status === 'rejected').length,
            adminUsers: allUsers.filter(user => user.role === 'admin').length,
            editPermissionUsers: allUsers.filter(user => user.permission === 'edit').length,
            viewPermissionUsers: allUsers.filter(user => user.permission === 'view').length,
        };
        return stats;
    }
    async updateUserRole(userId, body, req) {
        const admin = await this.usersService.findById(req.user.userId);
        if (!admin || !await this.usersService.isAdmin(admin)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        const updatedUser = await this.usersService.updateUserRole(userId, body.role, admin.username);
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async fixBaekAccount(req) {
        const admin = await this.usersService.findById(req.user.userId);
        if (!admin || !await this.usersService.isAdmin(admin)) {
            throw new common_1.ForbiddenException('Admin access required');
        }
        const baekUser = await this.usersService.findOne('baek');
        if (!baekUser) {
            return { message: 'baek account not found' };
        }
        const updatedUser = await this.usersService.updateUserRole(baekUser.id, user_entity_1.UserRole.ADMIN, admin.username);
        const { password, ...userWithoutPassword } = updatedUser;
        return { message: 'baek account promoted to admin', user: userWithoutPassword };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('admin/pending'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPendingUsers", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('admin/approve/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approveUser", null);
__decorate([
    (0, common_1.Post)('admin/reject/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "rejectUser", null);
__decorate([
    (0, common_1.Put)('admin/permission/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserPermission", null);
__decorate([
    (0, common_1.Put)('change-password'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAdminStats", null);
__decorate([
    (0, common_1.Put)('admin/role/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Post)('admin/fix-baek'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "fixBaekAccount", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map