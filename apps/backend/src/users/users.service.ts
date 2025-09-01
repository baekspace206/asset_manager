import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus, UserPermission } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    // Create baek admin account if it doesn't exist
    await this.ensureAdminExists();
  }

  private async ensureAdminExists() {
    // Remove existing baek user if exists
    const existingBaek = await this.findOne('baek');
    if (existingBaek) {
      await this.usersRepository.remove(existingBaek);
      console.log('Existing "baek" user removed');
    }

    // Create new admin baek user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = this.usersRepository.create({
      username: 'baek',
      password: hashedPassword,
      role: UserRole.ADMIN,
      status: UserStatus.APPROVED,
      permission: UserPermission.EDIT,
      approvedBy: 'system',
      approvedAt: new Date(),
    });
    await this.usersRepository.save(adminUser);
    console.log('Admin user "baek" created with password "admin123"');
  }

  async findOne(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user || undefined;
  }

  async create(username: string, password: string): Promise<User> {
    const existingUser = await this.findOne(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      status: UserStatus.PENDING,
      role: UserRole.USER,
      permission: UserPermission.VIEW,
    });
    return this.usersRepository.save(user);
  }

  async getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async getPendingUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { status: UserStatus.PENDING },
      order: { createdAt: 'DESC' }
    });
  }

  async approveUser(userId: number, approvedBy: string, permission: UserPermission): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== UserStatus.PENDING) {
      throw new BadRequestException('User is not pending approval');
    }

    user.status = UserStatus.APPROVED;
    user.permission = permission;
    user.approvedBy = approvedBy;
    user.approvedAt = new Date();
    user.rejectionReason = null;

    return this.usersRepository.save(user);
  }

  async rejectUser(userId: number, rejectedBy: string, reason: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== UserStatus.PENDING) {
      throw new BadRequestException('User is not pending approval');
    }

    user.status = UserStatus.REJECTED;
    user.rejectionReason = reason;
    user.approvedBy = rejectedBy;
    user.approvedAt = new Date();

    return this.usersRepository.save(user);
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);
  }

  async updateUserPermission(userId: number, permission: UserPermission, updatedBy: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.permission = permission;
    user.approvedBy = updatedBy;
    user.approvedAt = new Date();

    return this.usersRepository.save(user);
  }

  async isAdmin(user: User): Promise<boolean> {
    return user.role === UserRole.ADMIN;
  }

  async isApproved(user: User): Promise<boolean> {
    return user.status === UserStatus.APPROVED;
  }

  async hasEditPermission(user: User): Promise<boolean> {
    return user.permission === UserPermission.EDIT;
  }

  async updateUserRole(userId: number, role: UserRole, updatedBy: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;
    user.approvedBy = updatedBy;
    user.approvedAt = new Date();

    return this.usersRepository.save(user);
  }
}