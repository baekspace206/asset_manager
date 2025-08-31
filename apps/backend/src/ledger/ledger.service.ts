import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LedgerEntry } from './entities/ledger-entry.entity';
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
  ) {}

  async create(createLedgerEntryDto: CreateLedgerEntryDto, userId: number): Promise<LedgerEntry> {
    const entry = this.ledgerRepository.create({
      ...createLedgerEntryDto,
      userId,
    });
    return this.ledgerRepository.save(entry);
  }

  async findAll(userId: number): Promise<LedgerEntry[]> {
    return this.ledgerRepository.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<LedgerEntry> {
    const entry = await this.ledgerRepository.findOne({
      where: { id, userId },
    });
    if (!entry) {
      throw new NotFoundException('Ledger entry not found');
    }
    return entry;
  }

  async update(id: number, updateLedgerEntryDto: UpdateLedgerEntryDto, userId: number): Promise<LedgerEntry> {
    const entry = await this.findOne(id, userId);
    Object.assign(entry, updateLedgerEntryDto);
    return this.ledgerRepository.save(entry);
  }

  async remove(id: number, userId: number): Promise<{ success: boolean }> {
    const entry = await this.findOne(id, userId);
    await this.ledgerRepository.remove(entry);
    return { success: true };
  }

  async getMonthlyStats(userId: number, year?: number, month?: number): Promise<MonthlyStats[]> {
    let entries: LedgerEntry[] = [];
    
    if (year && month) {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
      entries = await this.ledgerRepository.find({
        where: { 
          userId,
          date: Between(startDate, endDate) as any
        },
        order: { date: 'DESC', createdAt: 'DESC' }
      });
    } else if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      entries = await this.ledgerRepository.find({
        where: { 
          userId,
          date: Between(startDate, endDate) as any
        },
        order: { date: 'DESC', createdAt: 'DESC' }
      });
    } else {
      entries = await this.ledgerRepository.find({
        where: { userId },
        order: { date: 'DESC', createdAt: 'DESC' }
      });
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
    const result = await this.ledgerRepository
      .createQueryBuilder('entry')
      .select('DISTINCT entry.category', 'category')
      .where('entry.userId = :userId', { userId })
      .getRawMany();

    return result.map(item => item.category).sort();
  }
}