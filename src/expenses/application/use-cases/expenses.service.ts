import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ExpensesRepositoryPort } from '../../domain/ports/expenses.repository.port';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { FilterExpenseDto } from '../dto/filter-expense.dto';
import { EXPENSES_REPOSITORY } from '../../tokens';
import { Expense } from '../../domain/entities/expense.entity';
import { PaginatedResult } from '../../domain/types/paginated-result.type';
//import { Like } from 'typeorm'; // Importamos Like para la búsqueda

@Injectable()
export class ExpensesService {
  constructor(
    @Inject(EXPENSES_REPOSITORY)
    private readonly expensesRepository: ExpensesRepositoryPort,
  ) { }

  async create(createExpenseDto: CreateExpenseDto) {
    // Convertimos el DTO a la entidad
    const expense = new Expense();
    Object.assign(expense, createExpenseDto);
    return this.expensesRepository.create(expense);
  }

  async findAll(filters: FilterExpenseDto): Promise<PaginatedResult<Expense>> {
    return this.expensesRepository.findAll(filters);
  }

  async findById(id: number) {
    const expense = await this.expensesRepository.findById(id);
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    // Verificamos que exista primero
    await this.findById(id);
    return this.expensesRepository.update(id, updateExpenseDto);
  }

  async remove(id: number) {
    await this.findById(id);
    return this.expensesRepository.delete(id);
  }

  async getStats() {
    return this.expensesRepository.getStatsByCategory();
  }
}