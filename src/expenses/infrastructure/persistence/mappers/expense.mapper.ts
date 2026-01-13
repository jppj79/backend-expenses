import { Expense } from '../../../domain/entity/expense.entity';
import { ExpenseEntity } from '../entities/expense.entity';

export class ExpenseMapper {
    static toDomain(expenseEntity: ExpenseEntity): Expense {
        const expense = new Expense();
        expense.id = expenseEntity.id;
        expense.description = expenseEntity.description;
        expense.amount = expenseEntity.amount;
        expense.date = expenseEntity.date;
        expense.category = expenseEntity.category;
        return expense;
    }

    static toPersistence(expense: Expense): ExpenseEntity {
        const expenseEntity = new ExpenseEntity();
        if (expense.id) {
            expenseEntity.id = expense.id;
        }
        expenseEntity.description = expense.description;
        expenseEntity.amount = expense.amount;
        expenseEntity.date = expense.date;
        expenseEntity.category = expense.category;
        return expenseEntity;
    }
}
