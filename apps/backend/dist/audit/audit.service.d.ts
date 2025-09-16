import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
export declare class AuditService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    logAction(action: string, entityType: string, entityId: number, entityName: string, oldValue?: any, newValue?: any, previousTotalValue?: number, currentTotalValue?: number): Promise<AuditLog>;
    getAuditLogs(): Promise<AuditLog[]>;
}
