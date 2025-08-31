import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { UsersService } from '../users/users.service';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Body() createAssetDto: CreateAssetDto, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.assetsService.create(createAssetDto);
  }

  @Get()
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.assetsService.update(+id, updateAssetDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !await this.usersService.hasEditPermission(user)) {
      throw new ForbiddenException('Edit permission required');
    }
    return this.assetsService.remove(+id);
  }
}
