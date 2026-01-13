import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('expenses')
export class ExpenseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column('text')
    description: string;

    @Column('numeric', { precision: 10, scale: 2 })
    amount: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
    date: Date;

    @Column({ type: 'varchar', length: 50 })
    category: string;
}
