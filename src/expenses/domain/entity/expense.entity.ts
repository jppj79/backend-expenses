import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('expenses') // Table name
export class Expense {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' }) // id BIGSERIAL [cite: 19]
  id: number;

  @Column('text') // description TEXT [cite: 20]
  description: string;

  @Column('numeric', { precision: 10, scale: 2 }) // amount NUMERIC(10,2) [cite: 21]
  amount: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' }) // date TIMESTAMP DEFAULT NOW() [cite: 22]
  date: Date;

  @Column({ type: 'varchar', length: 50 }) // category VARCHAR(50) [cite: 23]
  category: string;
}