import { LedgerService } from './ledger.service';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';
import { UpdateLedgerEntryDto } from './dto/update-ledger-entry.dto';
import { UsersService } from '../users/users.service';
export declare class LedgerController {
    private readonly ledgerService;
    private readonly usersService;
    constructor(ledgerService: LedgerService, usersService: UsersService);
    create(createLedgerEntryDto: CreateLedgerEntryDto, req: any): Promise<import("./entities/ledger-entry.entity").LedgerEntry>;
    findAll(req: any): Promise<import("./entities/ledger-entry.entity").LedgerEntry[]>;
    getMonthlyStats(req: any, year?: string, month?: string): Promise<import("./ledger.service").MonthlyStats[]>;
    getCategories(req: any): Promise<string[]>;
    getLogs(req: any, limit?: string): Promise<import("./entities/ledger-log.entity").LedgerLog[]>;
    findOne(id: string, req: any): Promise<import("./entities/ledger-entry.entity").LedgerEntry>;
    update(id: string, updateLedgerEntryDto: UpdateLedgerEntryDto, req: any): Promise<import("./entities/ledger-entry.entity").LedgerEntry>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
