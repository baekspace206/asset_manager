export declare enum LedgerLogAction {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
export declare class LedgerLog {
    id: number;
    entryId: number;
    userId: number;
    username: string;
    action: LedgerLogAction;
    description: string;
    amount: number;
    category: string;
    date: string;
    note: string;
    previousData: string;
    createdAt: Date;
}
