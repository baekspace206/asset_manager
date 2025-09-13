"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findOne(username) {
        const user = await this.usersRepository.findOne({ where: { username } });
        return user || undefined;
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        return user || undefined;
    }
    async create(username, password) {
        const existingUser = await this.findOne(username);
        if (existingUser) {
            throw new common_1.BadRequestException('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            username,
            password: hashedPassword,
            status: user_entity_1.UserStatus.PENDING,
            role: user_entity_1.UserRole.USER,
            permission: user_entity_1.UserPermission.VIEW,
        });
        return this.usersRepository.save(user);
    }
    async getAllUsers() {
        return this.usersRepository.find({
            order: { createdAt: 'DESC' }
        });
    }
    async getPendingUsers() {
        return this.usersRepository.find({
            where: { status: user_entity_1.UserStatus.PENDING },
            order: { createdAt: 'DESC' }
        });
    }
    async approveUser(userId, approvedBy, permission) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.status !== user_entity_1.UserStatus.PENDING) {
            throw new common_1.BadRequestException('User is not pending approval');
        }
        user.status = user_entity_1.UserStatus.APPROVED;
        user.permission = permission;
        user.approvedBy = approvedBy;
        user.approvedAt = new Date();
        user.rejectionReason = null;
        return this.usersRepository.save(user);
    }
    async rejectUser(userId, rejectedBy, reason) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.status !== user_entity_1.UserStatus.PENDING) {
            throw new common_1.BadRequestException('User is not pending approval');
        }
        user.status = user_entity_1.UserStatus.REJECTED;
        user.rejectionReason = reason;
        user.approvedBy = rejectedBy;
        user.approvedAt = new Date();
        return this.usersRepository.save(user);
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await this.usersRepository.save(user);
    }
    async updateUserPermission(userId, permission, updatedBy) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.permission = permission;
        user.approvedBy = updatedBy;
        user.approvedAt = new Date();
        return this.usersRepository.save(user);
    }
    async isAdmin(user) {
        return user.role === user_entity_1.UserRole.ADMIN;
    }
    async isApproved(user) {
        return user.status === user_entity_1.UserStatus.APPROVED;
    }
    async hasEditPermission(user) {
        return user.permission === user_entity_1.UserPermission.EDIT;
    }
    async updateUserRole(userId, role, updatedBy) {
        const user = await this.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        user.role = role;
        user.approvedBy = updatedBy;
        user.approvedAt = new Date();
        return this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map