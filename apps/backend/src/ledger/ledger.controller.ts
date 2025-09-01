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
  ForbiddenException,
  Query
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LedgerService } from './ledger.service';
import { CreateLedgerEntryDto } from './dto/create-ledger-entry.dto';
import { UpdateLedgerEntryDto } from './dto/update-ledger-entry.dto';
import { UsersService } from '../users/users.service';

@Controller('ledger')
@UseGuards(JwtAuthGuard)
export class LedgerController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createLedgerEntryDto: CreateLedgerEntryDto, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.ledgerService.create(createLedgerEntryDto, req.user.userId, user.username);
  }

  @Get()
  findAll(@Request() req) {
    return this.ledgerService.findAll(req.user.userId);
  }

  @Get('stats')
  getMonthlyStats(
    @Request() req,
    @Query('year') year?: string,
    @Query('month') month?: string
  ) {
    const yearNum = year ? parseInt(year) : undefined;
    const monthNum = month ? parseInt(month) : undefined;
    return this.ledgerService.getMonthlyStats(req.user.userId, yearNum, monthNum);
  }

  @Get('categories')
  getCategories(@Request() req) {
    return this.ledgerService.getCategories(req.user.userId);
  }

  @Get('logs')
  getLogs(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 50;
    return this.ledgerService.getLogs(req.user.userId, limitNum);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.ledgerService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateLedgerEntryDto: UpdateLedgerEntryDto, 
    @Request() req
  ) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.ledgerService.update(+id, updateLedgerEntryDto, req.user.userId, user.username);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.ledgerService.remove(+id, req.user.userId, user.username);
  }
}