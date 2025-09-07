import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary)
    private diaryRepository: Repository<Diary>,
  ) {}

  async create(createDiaryDto: CreateDiaryDto, userId: number): Promise<Diary> {
    const diary = this.diaryRepository.create({
      ...createDiaryDto,
      userId,
      date: new Date(createDiaryDto.date),
    });
    return this.diaryRepository.save(diary);
  }

  async findAll(userId: number): Promise<Diary[]> {
    return this.diaryRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Diary> {
    const diary = await this.diaryRepository.findOne({
      where: { id, userId },
    });
    if (!diary) {
      throw new NotFoundException('Diary entry not found');
    }
    return diary;
  }

  async update(id: number, updateDiaryDto: UpdateDiaryDto, userId: number): Promise<Diary> {
    const diary = await this.findOne(id, userId);
    
    if (updateDiaryDto.date) {
      updateDiaryDto.date = new Date(updateDiaryDto.date).toISOString();
    }
    
    Object.assign(diary, updateDiaryDto);
    return this.diaryRepository.save(diary);
  }

  async remove(id: number, userId: number): Promise<{ success: boolean }> {
    const diary = await this.findOne(id, userId);
    await this.diaryRepository.remove(diary);
    return { success: true };
  }
}