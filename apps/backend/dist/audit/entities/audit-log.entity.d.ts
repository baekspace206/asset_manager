export declare class AuditLog {
    id: number;
    action: string;
    entityType: string;
    entityId: number;
    entityName: string;
    oldValue: string | null;
    newValue: string | null;
    previousTotalValue: number | null;
    currentTotalValue: number | null;
    timestamp: Date;
}
