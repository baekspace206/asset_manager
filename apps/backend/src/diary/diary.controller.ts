import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  ForbiddenException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { UsersService } from '../users/users.service';

@Controller('diary')
@UseGuards(JwtAuthGuard)
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createDiaryDto: CreateDiaryDto, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.diaryService.create(createDiaryDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.diaryService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.diaryService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateDiaryDto: UpdateDiaryDto, 
    @Request() req
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.diaryService.update(+id, updateDiaryDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.diaryService.remove(+id, req.user.userId);
  }
}