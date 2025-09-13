import { UsersService } from './users.service';
import { UserPermission, UserRole } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<{
        id: number;
        username: string;
        role: UserRole;
        status: import("./entities/user.entity").UserStatus;
        permission: UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPendingUsers(req: any): Promise<import("./entities/user.entity").User[]>;
    getAllUsers(req: any): Promise<{
        id: number;
        username: string;
        role: UserRole;
        status: import("./entities/user.entity").UserStatus;
        permission: UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    approveUser(userId: number, body: {
        permission: UserPermission;
    }, req: any): Promise<{
        id: number;
        username: string;
        role: UserRole;
        status: import("./entities/user.entity").UserStatus;
        permission: UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    rejectUser(userId: number, body: {
        reason: string;
    }, req: any): Promise<{
        id: number;
        username: string;
        role: UserRole;
        status: import("./entities/user.entity").UserStatus;
        permission: UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserPermission(userId: number, body: {
        permission: UserPermission;
    }, req: any): Promise<{
        id: number;
        username: string;
        role: UserRole;
        status: import("./entities/user.entity").UserStatus;
        permission: UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(body: {
        oldPassword: string;
        newPassword: string;
    }, req: any): Promise<{
        message: string;
    }>;
    getAdminStats(req: any): Promise<{
        totalUsers: number;
        pendingUsers: number;
        approvedUsers: number;
        rejectedUsers: number;
        adminUsers: number;
        editPermissionUsers: number;
        viewPermissionUsers: number;
    }>;
    updateUserRole(userId: number, body: {
        role: UserRole;
    }, req: any): Promise<{
        id: number;
        username: string;
        role: UserRole;
        status: import("./entities/user.entity").UserStatus;
        permission: UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    fixBaekAccount(req: any): Promise<{
        message: string;
        user?: undefined;
    } | {
        message: string;
        user: {
            id: number;
            username: string;
            role: UserRole;
            status: import("./entities/user.entity").UserStatus;
            permission: UserPermission;
            approvedBy: string | null;
            approvedAt: Date | null;
            rejectionReason: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
}
