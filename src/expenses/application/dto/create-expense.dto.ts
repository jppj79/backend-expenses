import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Lunch at Restaurant', description: 'Description of the expense' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 50.0, description: 'Amount of the expense', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'Food', description: 'Category of the expense' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: '2023-10-27T10:00:00Z', description: 'Date of the expense', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;
}
