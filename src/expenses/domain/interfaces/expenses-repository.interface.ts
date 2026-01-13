import { Expense } from '../entity/expense.entity';
import { FilterExpenseDto } from '../../application/dto/filter-expense.dto';
import { PaginatedResult } from './paginated-result.interface';

// Contrato que debe cumplir cualquier base de datos que usemos
export interface IExpensesRepository {
  create(expense: Expense): Promise<Expense>;
  findAll(filters: FilterExpenseDto): Promise<PaginatedResult<Expense>>;
  findById(id: number): Promise<Expense | null>;
  update(id: number, expense: Partial<Expense>): Promise<void>;
  delete(id: number): Promise<void>;
}