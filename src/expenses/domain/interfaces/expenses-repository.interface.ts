import { Expense } from '../entity/expense.entity';
import { PaginatedResult } from './paginated-result.interface';
import { ExpenseCategoryStats } from './expense-stats.interface';
import { ExpenseFilters } from './expense-filters.interface';

// Contrato que debe cumplir cualquier base de datos que usemos
export interface IExpensesRepository {
  create(expense: Expense): Promise<Expense>;
  findAll(filters: ExpenseFilters): Promise<PaginatedResult<Expense>>;
  findById(id: number): Promise<Expense | null>;
  update(id: number, expense: Partial<Expense>): Promise<void>;
  delete(id: number): Promise<void>;
  getStatsByCategory(): Promise<ExpenseCategoryStats[]>;
}