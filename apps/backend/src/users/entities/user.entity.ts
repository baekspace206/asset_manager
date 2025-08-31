import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum UserStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum UserPermission {
  VIEW = 'view',
  EDIT = 'edit'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'text',
    default: UserRole.USER
  })
  role: UserRole;

  @Column({
    type: 'text',
    default: UserStatus.PENDING
  })
  status: UserStatus;

  @Column({
    type: 'text',
    default: UserPermission.VIEW
  })
  permission: UserPermission;

  @Column({ type: 'text', nullable: true })
  approvedBy: string | null;

  @Column({ type: 'text', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}