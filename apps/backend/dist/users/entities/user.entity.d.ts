export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare enum UserStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare enum UserPermission {
    VIEW = "view",
    EDIT = "edit"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    permission: UserPermission;
    approvedBy: string | null;
    approvedAt: Date | null;
    rejectionReason: string | null;
    createdAt: Date;
    updatedAt: Date;
}
