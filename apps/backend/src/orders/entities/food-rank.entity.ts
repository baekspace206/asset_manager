import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class FoodRank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  orderId: number;

  @Column()
  foodType: string;

  @Column()
  restaurantName: string;

  @Column({ type: 'text' })
  foodImage: string;

  @Column({ type: 'int', default: 5 })
  rating: number; // 1-10 점수

  @Column('date')
  date: Date;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}