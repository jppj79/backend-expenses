import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './domain/entity/expense.entity';
import { ExpensesController } from './presentation/controllers/expenses.controller';
import { ExpensesService } from './application/use-cases/expenses.service';
import { ExpensesRepository } from './infrastructure/repositories/expenses.repository';
import { EXPENSES_REPOSITORY } from './tokens';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [ExpensesController], // Aún vacío, lo llenaremos en el paso 7
  providers: [
    ExpensesService,
    {
      provide: EXPENSES_REPOSITORY, // Cuando pidan este token...
      useClass: ExpensesRepository, // ...usa esta clase.
    },
  ],
  exports: [ExpensesService],
})
export class ExpensesModule {}