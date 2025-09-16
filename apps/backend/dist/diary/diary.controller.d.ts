import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { UsersService } from '../users/users.service';
export declare class DiaryController {
    private readonly diaryService;
    private readonly usersService;
    constructor(diaryService: DiaryService, usersService: UsersService);
    create(createDiaryDto: CreateDiaryDto, req: any): Promise<import("./entities/diary.entity").Diary>;
    findAll(req: any): Promise<import("./entities/diary.entity").Diary[]>;
    findOne(id: string, req: any): Promise<import("./entities/diary.entity").Diary>;
    update(id: string, updateDiaryDto: UpdateDiaryDto, req: any): Promise<import("./entities/diary.entity").Diary>;
    remove(id: string, req: any): Promise<{
        success: boolean;
    }>;
}
