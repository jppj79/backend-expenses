import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesModule } from './expenses/expenses.module';
import { ExpenseEntity } from './expenses/infrastructure/persistence/entities/expense.entity';

@Module({
  imports: [
    // 1. Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Conexión a Base de Datos Async (lee las vars del .env)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [ExpenseEntity], // Registramos la entidad aquí
        synchronize: false, // SOLO para desarrollo (crea tablas auto)
      }),
    }),
    ExpensesModule,
  ],
})
export class AppModule { }