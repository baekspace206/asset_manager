import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UserPermission, UserRole } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Get('admin/pending')
  async getPendingUsers(@Request() req) {
    const admin = await this.usersService.findById(req.user.userId);
    if (!admin || !await this.usersService.isAdmin(admin)) {
      throw new ForbiddenException('Admin access required');
    }

    return this.usersService.getPendingUsers();
  }

  @Get('admin/all')
  async getAllUsers(@Request() req) {
    const admin = await this.usersService.findById(req.user.userId);
    if (!admin || !await this.usersService.isAdmin(admin)) {
      throw new ForbiddenException('Admin access required');
    }

    const users = await this.usersService.getAllUsers();
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  @Post('admin/approve/:userId')
  async approveUser(
    @Param('userId') userId: number,
    @Body() body: { permission: UserPermission },
    @Request() req
  ) {
    const admin = await this.usersService.findById(req.user.userId);
    if (!admin || !await this.usersService.isAdmin(admin)) {
      throw new ForbiddenException('Admin access required');
    }

    const approvedUser = await this.usersService.approveUser(
      userId,
      admin.username,
      body.permission
    );

    const { password, ...userWithoutPassword } = approvedUser;
    return userWithoutPassword;
  }

  @Post('admin/reject/:userId')
  async rejectUser(
    @Param('userId') userId: number,
    @Body() body: { reason: string },
    @Request() req
  ) {
    const admin = await this.usersService.findById(req.user.userId);
    if (!admin || !await this.usersService.isAdmin(admin)) {
      throw new ForbiddenException('Admin access required');
    }

    const rejectedUser = await this.usersService.rejectUser(
      userId,
      admin.username,
      body.reason
    );

    const { password, ...userWithoutPassword } = rejectedUser;
    return userWithoutPassword;
  }

  @Put('admin/permission/:userId')
  async updateUserPermission(
    @Param('userId') userId: number,
    @Body() body: { permission: UserPermission },
    @Request() req
  ) {
    const admin = await this.usersService.findById(req.user.userId);
    if (!admin || !await this.usersService.isAdmin(admin)) {
      throw new ForbiddenException('Admin access required');
    }

    const updatedUser = await this.usersService.updateUserPermission(
      userId,
      body.permission,
      admin.username
    );

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  @Put('change-password')
  async changePassword(
    @Body() body: { oldPassword: string; newPassword: string },
    @Request() req
  ) {
    if (!body.oldPassword || !body.newPassword) {
      throw new BadRequestException('Both old and new passwords are required');
    }

    if (body.newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters long');
    }

    await this.usersService.changePassword(
      req.user.userId,
      body.oldPassword,
      body.newPassword
    );

    return { message: 'Password changed successfully' };
  }

  @Get('admin/stats')
  async getAdminStats(@Request() req) {
    const admin = await this.usersService.findById(req.user.userId);
    if (!admin || !await this.usersService.isAdmin(admin)) {
      throw new ForbiddenException('Admin access required');
    }

    const allUsers = await this.usersService.getAllUsers();
    const pendingUsers = await this.usersService.getPendingUsers();
    
    const stats = {
      totalUsers: allUsers.length,
      pendingUsers: pendingUsers.length,
      approvedUsers: allUsers.filter(user => user.status === 'approved').length,
      rejectedUsers: allUsers.filter(user => user.status === 'rejected').length,
      adminUsers: allUsers.filter(user => user.role === 'admin').length,
      editPermissionUsers: allUsers.filter(user => user.permission === 'edit').length,
      viewPermissionUsers: allUsers.filter(user => user.permission === 'view').length,
    };

    return stats;
  }

  @Put('admin/role/:userId')
  async updateUserRole(
    @Param('userId') userId: number,
    @Body() body: { role: UserRole },
    @Request() req
  ) {
    const admin = await this.usersService.findById(req.user.userId);
    if (!admin || !await this.usersService.isAdmin(admin)) {
      throw new ForbiddenException('Admin access required');
    }

    const updatedUser = await this.usersService.updateUserRole(
      userId,
      body.role,
      admin.username
    );

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  @Post('admin/fix-baek')
  async fixBaekAccount(@Request() req) {
    const admin = await this.usersService.findById(req.user.userId);
    if (!admin || !await this.usersService.isAdmin(admin)) {
      throw new ForbiddenException('Admin access required');
    }

    const baekUser = await this.usersService.findOne('baek');
    if (!baekUser) {
      return { message: 'baek account not found' };
    }

    const updatedUser = await this.usersService.updateUserRole(
      baekUser.id,
      UserRole.ADMIN,
      admin.username
    );

    const { password, ...userWithoutPassword } = updatedUser;
    return { message: 'baek account promoted to admin', user: userWithoutPassword };
  }
}