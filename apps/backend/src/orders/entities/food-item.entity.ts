import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FoodRating } from './food-rating.entity';

@Entity()
export class FoodItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  orderId: number; // 주문에서 생성된 경우

  @Column()
  foodType: string;

  @Column()
  restaurantName: string;

  @Column({ type: 'text' })
  foodImage: string;

  @Column('date')
  date: Date;

  @Column({ type: 'text', nullable: true })
  description: string | null; // 음식 설명

  @Column()
  createdBy: number; // 최초 생성자

  @OneToMany(() => FoodRating, rating => rating.foodItem)
  ratings: FoodRating[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}