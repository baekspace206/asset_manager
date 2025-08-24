import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  category?: string;

  @Column('real', { default: 0 })
  amount: number;

  @Column({ nullable: true })
  note?: string;
}