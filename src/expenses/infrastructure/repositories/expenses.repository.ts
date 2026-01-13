import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Expense } from '../../domain/entity/expense.entity';
import { IExpensesRepository } from '../../domain/interfaces/expenses-repository.interface';
import { FilterExpenseDto } from '../../application/dto/filter-expense.dto';
import { PaginatedResult } from '../../domain/interfaces/paginated-result.interface';
import { ExpenseEntity } from '../persistence/entities/expense.entity';
import { ExpenseMapper } from '../persistence/mappers/expense.mapper';
import { ExpenseCategoryStats } from '../../domain/interfaces/expense-stats.interface';

@Injectable()
export class ExpensesRepository implements IExpensesRepository {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly typeOrmRepo: Repository<ExpenseEntity>,
  ) { }

  async create(expense: Expense): Promise<Expense> {
    const expenseEntity = ExpenseMapper.toPersistence(expense);
    const savedEntity = await this.typeOrmRepo.save(expenseEntity);
    return ExpenseMapper.toDomain(savedEntity);
  }

  async findAll(filters: FilterExpenseDto): Promise<PaginatedResult<Expense>> {
    const { page = 1, limit = 10, category, query } = filters;
    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<ExpenseEntity> | FindOptionsWhere<ExpenseEntity>[];

    if (query) {
      where = [
        { description: ILike(`%${query}%`), ...(category && { category }) },
      ];
    } else {
      where = category ? { category } : {};
    }

    const [data, total] = await this.typeOrmRepo.findAndCount({
      where,
      skip,
      take: limit,
      order: { date: 'DESC' } as any,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((item) => ExpenseMapper.toDomain(item)),
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    };
  }

  async getStatsByCategory(): Promise<ExpenseCategoryStats[]> {
    const rawData = await this.typeOrmRepo
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'totalAmount')
      .addSelect('COUNT(expense.id)', 'count')
      .groupBy('expense.category')
      .getRawMany();

    return rawData.map((item) => ({
      category: item.category,
      totalAmount: parseFloat(item.totalAmount),
      count: parseInt(item.count, 10),
    }));
  }

  async findById(id: number): Promise<Expense | null> {
    const entity = await this.typeOrmRepo.findOne({ where: { id } });
    if (!entity) return null;
    return ExpenseMapper.toDomain(entity);
  }

  async update(id: number, expense: Partial<Expense>): Promise<void> {
    // Note: This is partial, creating a more robust update might require fetching first
    // but for now, we follow the pattern. 
    // Ideally update should accept a full domain object or we partial update the persistence layer
    await this.typeOrmRepo.update(id, expense);
  }

  async delete(id: number): Promise<void> {
    await this.typeOrmRepo.delete(id);
  }
}
