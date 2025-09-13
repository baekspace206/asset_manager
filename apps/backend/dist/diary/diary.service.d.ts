import { Repository } from 'typeorm';
import { Diary } from './entities/diary.entity';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
export declare class DiaryService {
    private diaryRepository;
    constructor(diaryRepository: Repository<Diary>);
    create(createDiaryDto: CreateDiaryDto, userId: number): Promise<Diary>;
    findAll(userId: number): Promise<Diary[]>;
    findOne(id: number, userId: number): Promise<Diary>;
    update(id: number, updateDiaryDto: UpdateDiaryDto, userId: number): Promise<Diary>;
    remove(id: number, userId: number): Promise<{
        success: boolean;
    }>;
}
