import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from '../../application/use-cases/expenses.service';
import { CreateExpenseDto } from '../../application/dto/create-expense.dto';
import { NotFoundException } from '@nestjs/common';
import { FilterExpenseDto } from '../../application/dto/filter-expense.dto';
import { UpdateExpenseDto } from '../../application/dto/update-expense.dto';
import { Expense } from '../../domain/entity/expense.entity';
import { PaginatedResult } from '../../domain/interfaces/paginated-result.interface';

// Mock del servicio para aislar el controlador
const mockExpensesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
};

describe('ExpensesController', () => {
    let controller: ExpensesController;
    let service: ExpensesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExpensesController],
            providers: [
                {
                    provide: ExpensesService,
                    useValue: mockExpensesService,
                },
            ],
        }).compile();

        controller = module.get<ExpensesController>(ExpensesController);
        service = module.get<ExpensesService>(ExpensesService);

        // Limpiar mocks antes de cada test para asegurar aislamiento
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create an expense and return it', async () => {
            const dto: CreateExpenseDto = {
                description: 'Lunch',
                amount: 50,
                category: 'Food',
                date: new Date(),
            };

            const expectedResult = { id: 1, ...dto };
            mockExpensesService.create.mockResolvedValue(expectedResult);

            const result = await controller.create(dto);

            expect(service.create).toHaveBeenCalledWith(dto);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAll', () => {
        it('should return a paginated list of expenses', async () => {
            const filters: FilterExpenseDto = { page: 1, limit: 10 };
            const expectedResult: PaginatedResult<Expense> = {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
            };

            mockExpensesService.findAll.mockResolvedValue(expectedResult);

            const result = await controller.findAll(filters);

            expect(service.findAll).toHaveBeenCalledWith(filters);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('search', () => {
        it('should call findAll with query', async () => {
            const query = 'coffee';
            const expectedFilter = { query };

            await controller.search(query);

            expect(service.findAll).toHaveBeenCalledWith(expectedFilter);
        });
    });

    describe('findById', () => {
        it('should return a single expense', async () => {
            const id = 1;
            const expectedResult = { id, description: 'Test', amount: 100 };
            mockExpensesService.findById.mockResolvedValue(expectedResult);

            const result = await controller.findById(id);

            expect(service.findById).toHaveBeenCalledWith(id);
            expect(result).toEqual(expectedResult);
        });

        it('should propagate NotFoundException when service throws', async () => {
            const id = 999;
            mockExpensesService.findById.mockRejectedValue(new NotFoundException());

            await expect(controller.findById(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should call update service with correct types', async () => {
            const id = 1;
            const dto: UpdateExpenseDto = { amount: 200 };

            mockExpensesService.update.mockResolvedValue(undefined);

            await controller.update(id, dto);

            // Verificamos que el ID se pasa como número y el DTO correctamente
            expect(service.update).toHaveBeenCalledWith(expect.any(Number), dto);
            expect(service.update).toHaveBeenCalledWith(id, dto);
        });
    });

    describe('remove', () => {
        it('should call remove service', async () => {
            const id = 1;
            mockExpensesService.remove.mockResolvedValue(undefined);

            await controller.remove(id);

            expect(service.remove).toHaveBeenCalledWith(id);
        });
    });
});
