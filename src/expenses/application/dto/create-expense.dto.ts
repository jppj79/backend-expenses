import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer'; // Importante para la conversión

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @Type(() => Date) // <--- Convierte el string ISO a un objeto Date de JS
  @IsDate()         // <--- Valida que sea un objeto Date válido tras la conversión
  date?: Date;      // <--- Cambiamos el tipo de string a Date
}