import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Put,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ExpensesService } from '../../application/use-cases/expenses.service';
import { CreateExpenseDto } from '../../application/dto/create-expense.dto';
import { UpdateExpenseDto } from '../../application/dto/update-expense.dto';
import { FilterExpenseDto } from '../../application/dto/filter-expense.dto';
import { ExpenseStatsDto } from '../../application/dto/expense-stats.dto';

@ApiTags('expenses')
@Controller('expenses') // Esto generará la ruta /api/expenses (configuraremos 'api' en el paso 8)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'The expense has been successfully created.' })
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  // IMPORTANTE: Esta ruta debe ir antes de :id para evitar conflictos
  @Get('search')
  @ApiOperation({ summary: 'Search expenses by description query' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Return search results.' })
  search(@Query('query') query: string) {
    // Reutilizamos el filtro del findAll pero forzando el query
    return this.expensesService.findAll({ query } as FilterExpenseDto);
  }

  @Get('stats/category')
  @ApiOperation({ summary: 'Get aggregated expenses by category' })
  @ApiResponse({ status: 200, description: 'Return stats.', type: ExpenseStatsDto, isArray: true })
  getStats() {
    return this.expensesService.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all expenses.' })
  findAll(@Query() filterDto: FilterExpenseDto) {
    return this.expensesService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense by ID' })
  @ApiResponse({ status: 200, description: 'Return the expense.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe convierte automáticamente el string "1" a numero 1
    // o lanza error 400 si no es número.
    return this.expensesService.findById(id);
  }

  @Put(':id') // El PDF pide PUT para actualizar [cite: 30]
  @HttpCode(204)
  @ApiOperation({ summary: 'Update an existing expense' })
  @ApiResponse({ status: 204, description: 'The expense has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto
  ) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({ status: 200, description: 'The expense has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.remove(id);
  }
}