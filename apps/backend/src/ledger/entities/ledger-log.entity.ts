import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum LedgerLogAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete'
}

@Entity()
export class LedgerLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entryId: number;

  @Column()
  userId: number;

  @Column()
  username: string;

  @Column({
    type: 'text',
    enum: LedgerLogAction
  })
  action: LedgerLogAction;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  category: string;

  @Column()
  date: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'text', nullable: true })
  previousData: string; // JSON string for updates

  @CreateDateColumn()
  createdAt: Date;
}