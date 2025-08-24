import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async logAction(
    action: string,
    entityType: string,
    entityId: number,
    entityName: string,
    oldValue?: any,
    newValue?: any
  ): Promise<AuditLog> {
    const auditLog = new AuditLog();
    auditLog.action = action;
    auditLog.entityType = entityType;
    auditLog.entityId = entityId;
    auditLog.entityName = entityName;
    auditLog.oldValue = oldValue ? JSON.stringify(oldValue) : null;
    auditLog.newValue = newValue ? JSON.stringify(newValue) : null;

    return await this.auditLogRepository.save(auditLog);
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      order: { timestamp: 'DESC' },
      take: 50, // Limit to last 50 entries
    });
  }
}