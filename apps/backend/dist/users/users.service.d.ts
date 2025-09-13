import { Repository } from 'typeorm';
import { User, UserRole, UserPermission } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findOne(username: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    create(username: string, password: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getPendingUsers(): Promise<User[]>;
    approveUser(userId: number, approvedBy: string, permission: UserPermission): Promise<User>;
    rejectUser(userId: number, rejectedBy: string, reason: string): Promise<User>;
    changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void>;
    updateUserPermission(userId: number, permission: UserPermission, updatedBy: string): Promise<User>;
    isAdmin(user: User): Promise<boolean>;
    isApproved(user: User): Promise<boolean>;
    hasEditPermission(user: User): Promise<boolean>;
    updateUserRole(userId: number, role: UserRole, updatedBy: string): Promise<User>;
}
