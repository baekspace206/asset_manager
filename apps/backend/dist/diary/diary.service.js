"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const diary_entity_1 = require("./entities/diary.entity");
let DiaryService = class DiaryService {
    diaryRepository;
    constructor(diaryRepository) {
        this.diaryRepository = diaryRepository;
    }
    async create(createDiaryDto, userId) {
        const diary = this.diaryRepository.create({
            ...createDiaryDto,
            userId,
            date: new Date(createDiaryDto.date),
        });
        return this.diaryRepository.save(diary);
    }
    async findAll(userId) {
        return this.diaryRepository.find({
            where: { userId },
            order: { date: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const diary = await this.diaryRepository.findOne({
            where: { id, userId },
        });
        if (!diary) {
            throw new common_1.NotFoundException('Diary entry not found');
        }
        return diary;
    }
    async update(id, updateDiaryDto, userId) {
        const diary = await this.findOne(id, userId);
        if (updateDiaryDto.date) {
            updateDiaryDto.date = new Date(updateDiaryDto.date).toISOString();
        }
        Object.assign(diary, updateDiaryDto);
        return this.diaryRepository.save(diary);
    }
    async remove(id, userId) {
        const diary = await this.findOne(id, userId);
        await this.diaryRepository.remove(diary);
        return { success: true };
    }
};
exports.DiaryService = DiaryService;
exports.DiaryService = DiaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(diary_entity_1.Diary)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DiaryService);
//# sourceMappingURL=diary.service.js.map