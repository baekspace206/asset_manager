import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../users/entities/user.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
            status: any;
            permission: any;
        };
    }>;
    register(username: string, password: string): Promise<{
        id: number;
        username: string;
        role: import("../users/entities/user.entity").UserRole;
        status: UserStatus;
        permission: import("../users/entities/user.entity").UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfileWithPermissions(userId: number): Promise<{
        isAdmin: boolean;
        isApproved: boolean;
        hasEditPermission: boolean;
        id: number;
        username: string;
        role: import("../users/entities/user.entity").UserRole;
        status: UserStatus;
        permission: import("../users/entities/user.entity").UserPermission;
        approvedBy: string | null;
        approvedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
