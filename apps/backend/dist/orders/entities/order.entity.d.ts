export declare enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed"
}
export declare class Order {
    id: number;
    userId: number;
    date: string;
    foodType: string;
    details: string;
    status: OrderStatus;
    completedImage: string | null;
    completedComment: string | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
