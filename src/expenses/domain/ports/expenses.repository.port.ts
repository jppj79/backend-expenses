import { Expense } from '../entities/expense.entity';
import { PaginatedResult } from '../types/paginated-result.type';
import { ExpenseCategoryStats } from '../types/expense-stats.type';
import { ExpenseFilters } from '../types/expense-filters.type';

// Contrato que debe cumplir cualquier base de datos que usemos
export interface ExpensesRepositoryPort {
  create(expense: Expense): Promise<Expense>;
  findAll(filters: ExpenseFilters): Promise<PaginatedResult<Expense>>;
  findById(id: number): Promise<Expense | null>;
  update(id: number, expense: Partial<Expense>): Promise<void>;
  delete(id: number): Promise<void>;
  getStatsByCategory(): Promise<ExpenseCategoryStats[]>;
}