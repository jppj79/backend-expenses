import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Expense } from '../../domain/entity/expense.entity';
import { IExpensesRepository } from '../../domain/interfaces/expenses-repository.interface';
import { FilterExpenseDto } from '../../application/dto/filter-expense.dto';
import { PaginatedResult } from '../../domain/interfaces/paginated-result.interface';

@Injectable()
export class ExpensesRepository implements IExpensesRepository {
  constructor(
    @InjectRepository(Expense)
    private readonly typeOrmRepo: Repository<Expense>,
  ) {}

  async create(expense: Expense): Promise<Expense> {
    return this.typeOrmRepo.save(expense);
  }

  async findAll(filters: FilterExpenseDto): Promise<PaginatedResult<Expense>> {
  const { page = 1, limit = 10, category, query } = filters;
  const skip = (page - 1) * limit;

  // 1. Definimos el tipo de 'where' como un arreglo o un objeto único
  let where: FindOptionsWhere<Expense> | FindOptionsWhere<Expense>[];

  if (query) {
    // 2. Si hay query, buscamos en múltiples campos (OR)
    // Cada objeto en este array es un "OR". La categoría se repite en ambos para mantener el "AND"
    where = [
      { description: ILike(`%${query}%`), ...(category && { category }) },
      // Aquí puedes agregar más campos fácilmente en el futuro:
      // { merchant: ILike(`%${query}%`), ...(category && { category }) },
      // Equivale a;
      // (description ILIKE %q% AND category = 'cat') OR (merchant ILIKE %q% AND category = 'cat')
    ];
  } else {
    // 3. Si no hay query, solo filtramos por categoría si existe
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
    data,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
    },
  };
}

  async findById(id: number): Promise<Expense | null> {
    return this.typeOrmRepo.findOne({ where: { id } });
  }

  async update(id: number, expense: Partial<Expense>): Promise<void> {
    await this.typeOrmRepo.update(id, expense);
  }

  async delete(id: number): Promise<void> {
    // El PDF menciona soft delete o hard delete[cite: 36].
    // Usaremos delete simple (hard) por ahora.
    await this.typeOrmRepo.delete(id);
  }
}