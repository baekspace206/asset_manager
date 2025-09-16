import { Repository } from 'typeorm';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { LedgerLog } from './entities/ledger-log.entity';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';
import { UpdateLedgerEntryDto } from './dto/update-ledger-entry.dto';
export interface MonthlyStats {
    month: string;
    categories: {
        [category: string]: {
            total: number;
            count: number;
            entries: LedgerEntry[];
        };
    };
    totalAmount: number;
}
export declare class LedgerService {
    private ledgerRepository;
    private ledgerLogRepository;
    constructor(ledgerRepository: Repository<LedgerEntry>, ledgerLogRepository: Repository<LedgerLog>);
    create(createLedgerEntryDto: CreateLedgerEntryDto, userId: number, username: string): Promise<LedgerEntry>;
    findAll(userId: number): Promise<LedgerEntry[]>;
    findOne(id: number, userId: number): Promise<LedgerEntry>;
    update(id: number, updateLedgerEntryDto: UpdateLedgerEntryDto, userId: number, username: string): Promise<LedgerEntry>;
    remove(id: number, userId: number, username: string): Promise<{
        success: boolean;
    }>;
    getMonthlyStats(userId: number, year?: number, month?: number): Promise<MonthlyStats[]>;
    getCategories(userId: number): Promise<string[]>;
    private createLogEntry;
    getLogs(userId: number, limit?: number): Promise<LedgerLog[]>;
}
