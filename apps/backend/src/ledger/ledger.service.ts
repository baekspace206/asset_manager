import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LedgerEntry } from './entities/ledger-entry.entity';
import { LedgerLog, LedgerLogAction } from './entities/ledger-log.entity';
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

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntry)
    private ledgerRepository: Repository<LedgerEntry>,
    @InjectRepository(LedgerLog)
    private ledgerLogRepository: Repository<LedgerLog>,
  ) {}

  async create(createLedgerEntryDto: CreateLedgerEntryDto, userId: number, username: string): Promise<LedgerEntry> {
    const entry = this.ledgerRepository.create({
      ...createLedgerEntryDto,
      userId,
    });
    const savedEntry = await this.ledgerRepository.save(entry);
    
    // Create log entry
    await this.createLogEntry(savedEntry, userId, username, LedgerLogAction.CREATE);
    
    return savedEntry;
  }

  async findAll(userId: number): Promise<LedgerEntry[]> {
    return this.ledgerRepository.find({
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<LedgerEntry> {
    const entry = await this.ledgerRepository.findOne({
      where: { id },
    });
    if (!entry) {
      throw new NotFoundException('Ledger entry not found');
    }
    return entry;
  }

  async update(id: number, updateLedgerEntryDto: UpdateLedgerEntryDto, userId: number, username: string): Promise<LedgerEntry> {
    const entry = await this.findOne(id, userId);
    const previousData = JSON.stringify({
      description: entry.description,
      amount: entry.amount,
      category: entry.category,
      date: entry.date,
      note: entry.note
    });
    
    Object.assign(entry, updateLedgerEntryDto);
    const updatedEntry = await this.ledgerRepository.save(entry);
    
    // Create log entry
    await this.createLogEntry(updatedEntry, userId, username, LedgerLogAction.UPDATE, previousData);
    
    return updatedEntry;
  }

  async remove(id: number, userId: number, username: string): Promise<{ success: boolean }> {
    const entry = await this.findOne(id, userId);
    
    // Create log entry before deletion
    await this.createLogEntry(entry, userId, username, LedgerLogAction.DELETE);
    
    await this.ledgerRepository.remove(entry);
    return { success: true };
  }

  async getMonthlyStats(userId: number, year?: number, month?: number): Promise<MonthlyStats[]> {
    let entries: LedgerEntry[] = [];
    
    try {
      if (year && month) {
        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
        entries = await this.ledgerRepository.find({
          where: { 
            date: Between(startDate, endDate) as any
          },
          order: { date: 'DESC', createdAt: 'DESC' }
        });
      } else if (year) {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        entries = await this.ledgerRepository.find({
          where: { 
            date: Between(startDate, endDate) as any
          },
          order: { date: 'DESC', createdAt: 'DESC' }
        });
      } else {
        entries = await this.ledgerRepository.find({
          order: { date: 'DESC', createdAt: 'DESC' }
        });
      }
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return [];
    }

    const monthlyData: { [key: string]: MonthlyStats } = {};

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          categories: {},
          totalAmount: 0,
        };
      }

      if (!monthlyData[monthKey].categories[entry.category]) {
        monthlyData[monthKey].categories[entry.category] = {
          total: 0,
          count: 0,
          entries: [],
        };
      }

      monthlyData[monthKey].categories[entry.category].total += entry.amount;
      monthlyData[monthKey].categories[entry.category].count += 1;
      monthlyData[monthKey].categories[entry.category].entries.push(entry);
      monthlyData[monthKey].totalAmount += entry.amount;
    });

    return Object.values(monthlyData).sort((a, b) => b.month.localeCompare(a.month));
  }

  async getCategories(userId: number): Promise<string[]> {
    // Validate userId to prevent NaN errors
    if (!userId || isNaN(Number(userId))) {
      console.error('Invalid userId provided to getCategories:', userId);
      return [];
    }

    try {
      const result = await this.ledgerRepository
        .createQueryBuilder('entry')
        .select('DISTINCT entry.category', 'category')
        .getRawMany();

      return result.map(item => item.category).sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  private async createLogEntry(
    entry: LedgerEntry, 
    userId: number, 
    username: string, 
    action: LedgerLogAction, 
    previousData?: string
  ): Promise<void> {
    const logEntry = this.ledgerLogRepository.create({
      entryId: entry.id,
      userId,
      username,
      action,
      description: entry.description,
      amount: entry.amount,
      category: entry.category,
      date: entry.date instanceof Date ? entry.date.toISOString().split('T')[0] : String(entry.date),
      note: entry.note || '',
      previousData
    });

    await this.ledgerLogRepository.save(logEntry);
  }

  async getLogs(userId: number, limit: number = 50): Promise<LedgerLog[]> {
    try {
      return await this.ledgerLogRepository.find({
        order: { createdAt: 'DESC' },
        take: limit
      });
    } catch (error) {
      console.error('Error fetching ledger logs:', error);
      return []; // Return empty array if table doesn't exist or other error
    }
  }
}