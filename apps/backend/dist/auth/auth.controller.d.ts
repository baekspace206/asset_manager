import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
            status: any;
            permission: any;
        };
    }>;
    register(body: {
        username: string;
        password: string;
    }): Promise<{
        id: number;
        username: string;
        role: UserRole;
        status: import("../users/entities/user.entity").UserStatus;
        permission: import("../users/entities/user.entity").UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): Promise<{
        isAdmin: boolean;
        isApproved: boolean;
        hasEditPermission: boolean;
        id: number;
        username: string;
        role: UserRole;
        status: import("../users/entities/user.entity").UserStatus;
        permission: import("../users/entities/user.entity").UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    fixBaekAccount(): Promise<{
        message: string;
    }>;
}
