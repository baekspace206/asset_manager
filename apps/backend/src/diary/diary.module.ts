import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { Diary } from './entities/diary.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    UsersModule
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService]
})
export class DiaryModule {}