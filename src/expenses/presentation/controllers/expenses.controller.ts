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
import { ExpensesService } from '../../application/use-cases/expenses.service';
import { CreateExpenseDto } from '../../application/dto/create-expense.dto';
import { UpdateExpenseDto } from '../../application/dto/update-expense.dto';
import { FilterExpenseDto } from '../../application/dto/filter-expense.dto';

@Controller('expenses') // Esto generará la ruta /api/expenses (configuraremos 'api' en el paso 8)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  // IMPORTANTE: Esta ruta debe ir antes de :id para evitar conflictos
  @Get('search') 
  search(@Query('query') query: string) {
    // Reutilizamos el filtro del findAll pero forzando el query
    return this.expensesService.findAll({ query } as FilterExpenseDto);
  }

  @Get()
  findAll(@Query() filterDto: FilterExpenseDto) {
    return this.expensesService.findAll(filterDto);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) { 
    // ParseIntPipe convierte automáticamente el string "1" a numero 1
    // o lanza error 400 si no es número.
    return this.expensesService.findById(id);
  }

  @Put(':id') // El PDF pide PUT para actualizar [cite: 30]
  @HttpCode(204)
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateExpenseDto: UpdateExpenseDto
  ) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.expensesService.remove(id);
  }
}