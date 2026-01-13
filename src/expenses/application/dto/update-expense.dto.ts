import { PartialType } from '@nestjs/mapped-types'; // Necesitarás instalar esto si falla
import { CreateExpenseDto } from './create-expense.dto';

// Si @nestjs/mapped-types no está instalado, ejecuta: npm i @nestjs/mapped-types
export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}