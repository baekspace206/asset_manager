import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // 'CREATE', 'UPDATE', 'DELETE'

  @Column()
  entityType: string; // 'Asset'

  @Column()
  entityId: number;

  @Column()
  entityName: string;

  @Column({ type: 'text', nullable: true })
  oldValue: string | null; // JSON string of old values

  @Column({ type: 'text', nullable: true })
  newValue: string | null; // JSON string of new values

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  previousTotalValue: number | null;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  currentTotalValue: number | null;

  @CreateDateColumn()
  timestamp: Date;
}