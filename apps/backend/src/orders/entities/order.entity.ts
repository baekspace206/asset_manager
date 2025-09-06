import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  date: string;

  @Column()
  foodType: string;

  @Column({ type: 'text' })
  details: string;

  @Column({
    type: 'text',
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ type: 'text', nullable: true })
  completedImage: string | null;

  @Column({ type: 'text', nullable: true })
  completedComment: string | null;

  @Column({ type: 'text', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}