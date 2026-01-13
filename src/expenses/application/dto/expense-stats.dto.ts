import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategoryStats } from '../../domain/types/expense-stats.type';

export class ExpenseStatsDto implements ExpenseCategoryStats {
    @ApiProperty({ example: 'Food', description: 'Category name' })
    category: string;

    @ApiProperty({ example: 150.50, description: 'Total amount for the category' })
    totalAmount: number;

    @ApiProperty({ example: 5, description: 'Count of expenses in this category' })
    count: number;
}
