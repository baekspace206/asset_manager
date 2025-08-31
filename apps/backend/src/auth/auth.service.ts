import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Check if user is approved
    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException('Your account is pending approval. Please wait for admin approval.');
    }

    if (user.status === UserStatus.REJECTED) {
      throw new UnauthorizedException('Your account has been rejected. Please contact the administrator.');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.id, 
      userId: user.id,
      role: user.role,
      status: user.status,
      permission: user.permission
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        status: user.status,
        permission: user.permission,
      },
    };
  }

  async register(username: string, password: string) {
    if (!username || username.trim().length < 3) {
      throw new BadRequestException('Username must be at least 3 characters long');
    }

    if (!password || password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const user = await this.usersService.create(username.trim(), password);
    const { password: _, ...result } = user;
    return result;
  }

  async getProfileWithPermissions(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...userProfile } = user;
    return {
      ...userProfile,
      isAdmin: await this.usersService.isAdmin(user),
      isApproved: await this.usersService.isApproved(user),
      hasEditPermission: await this.usersService.hasEditPermission(user),
    };
  }
}