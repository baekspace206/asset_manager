import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { FoodItem } from './food-item.entity';

@Entity()
@Unique(['foodItemId', 'userId']) // 한 사용자는 하나의 음식에 대해 하나의 평점만
export class FoodRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foodItemId: number;

  @Column()
  userId: number;

  @Column({ type: 'int', default: 5 })
  rating: number; // 1-10 점수

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @ManyToOne(() => FoodItem, foodItem => foodItem.ratings)
  @JoinColumn({ name: 'foodItemId' })
  foodItem: FoodItem;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}