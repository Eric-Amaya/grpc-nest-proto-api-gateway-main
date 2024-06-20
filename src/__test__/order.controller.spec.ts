import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order/order.controller';
import { ClientGrpc } from '@nestjs/microservices';
import {
  OrderServiceClient,
  ORDER_SERVICE_NAME,
  CreateTableRequest,
  CreateTableResponse,
  GetTablesByNameRequest,
  GetTablesByNameResponse,
  GetAllTablesRequest,
  GetAllTablesResponse,
  UpdateTableStateRequest,
  UpdateTableStateResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderRequest,
  GetOrderResponse,
  GetAllOrdersRequest,
  GetAllOrdersResponse,
  CreateSaleRequest,
  CreateSaleResponse,
  GetAllSalesRequest,
  GetAllSalesResponse,
  GetSalesByUserRequest,
  GetSalesByUserResponse,
  GetSalesByDateRequest,
  GetSalesByDateResponse,
  DeleteOrderItemRequest,
  DeleteOrderItemResponse,
  UpdateOrderRequest,
  UpdateOrderResponse,
} from '../order/order.pb';
import { firstValueFrom, of } from 'rxjs';
import { AuthGuard } from '../guard/auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

describe('OrderController (Gateway)', () => {
  let controller: OrderController;
  let client: ClientGrpc;
  let orderService: OrderServiceClient;

  const mockOrderServiceClient = {
    createTable: jest.fn().mockReturnValue(of({ status: 201, errors: [] })),
    getTablesByName: jest.fn().mockReturnValue(
      of({
        status: 200,
        errors: [],
        table: {
          id: 1,
          name: 'Table 1',
          quantity: 4,
          state: 'available',
          activeOrderId: 1,
        },
      }),
    ),
    getAllTables: jest
      .fn()
      .mockReturnValue(of({ status: 200, errors: [], tables: [] })),
    updateTableState: jest
      .fn()
      .mockReturnValue(of({ status: 200, errors: [] })),
    createOrder: jest.fn().mockReturnValue(
      of({
        status: 201,
        errors: [],
        id: 1,
      }),
    ),
    getOrder: jest.fn().mockReturnValue(
      of({
        status: 200,
        errors: [],
        order: {
          id: 1,
          userId: 1,
          table: {
            id: 1,
            name: 'Table 1',
            quantity: 4,
            state: 'available',
            activeOrderId: 1,
          },
          totalPrice: 20,
          items: [
            {
              productId: 1,
              quantity: 2,
              modifications: '',
              productName: 'Product 1',
              pricePerUnit: 10,
              totalPrice: 20,
            },
          ],
          user: {
            id: 1,
            name: 'test',
            email: 'test@test.com',
            role: 'admin',
          },
          email: 'test@test.com',
        },
      }),
    ),
    getAllOrders: jest
      .fn()
      .mockReturnValue(of({ status: 200, errors: [], orders: [] })),
    createSale: jest.fn().mockReturnValue(of({ status: 201, errors: [] })),
    getAllSales: jest
      .fn()
      .mockReturnValue(of({ status: 200, errors: [], sales: [] })),
    getSalesByUser: jest
      .fn()
      .mockReturnValue(of({ status: 200, errors: [], sales: [] })),
    getSalesByDate: jest
      .fn()
      .mockReturnValue(of({ status: 200, errors: [], sales: [] })),
    deleteOrderItem: jest.fn().mockReturnValue(of({ status: 200, errors: [] })),
    updateOrder: jest.fn().mockReturnValue(of({ status: 200, errors: [] })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: ORDER_SERVICE_NAME,
          useValue: {
            getService: jest.fn().mockReturnValue(mockOrderServiceClient),
          },
        },
        {
          provide: 'ClientGrpc',
          useValue: {
            getService: jest.fn().mockReturnValue(mockOrderServiceClient),
          },
        },
        Reflector,
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue({}),
            sign: jest.fn().mockReturnValue('mockedJwtToken'),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    client = module.get<ClientGrpc>('ClientGrpc');
    orderService = client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);

    controller.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createTable method', async () => {
    const payload: CreateTableRequest = {
      name: 'Table 1',
      quantity: 4,
      state: 'available',
    };
    const expectedResult: CreateTableResponse = { status: 201, errors: [] };

    jest.spyOn(orderService, 'createTable').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.createTable(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call getTablesByName method', async () => {
    const payload: GetTablesByNameRequest = { name: 'Table 1' };
    const expectedResult: GetTablesByNameResponse = {
      status: 200,
      errors: [],
      table: {
        id: 1,
        name: 'Table 1',
        quantity: 4,
        state: 'available',
        activeOrderId: 1,
      },
    };

    jest
      .spyOn(orderService, 'getTablesByName')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(
      controller.getTablesByName(payload.name),
    );
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call getAllTables method', async () => {
    const expectedResult: GetAllTablesResponse = {
      status: 200,
      errors: [],
      tables: [],
    };

    jest
      .spyOn(orderService, 'getAllTables')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.getAllTables());
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call updateTableState method', async () => {
    const payload: UpdateTableStateRequest = {
      id: 1,
      quantity: 4,
      state: 'occupied',
      activeOrderId: 1,
    };
    const expectedResult: UpdateTableStateResponse = {
      status: 200,
      errors: [],
    };

    jest
      .spyOn(orderService, 'updateTableState')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.updateTableState(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call createOrder method', async () => {
    const payload: CreateOrderRequest = {
      products: [
        {
          productId: 1,
          quantity: 2,
          modifications: '',
          productName: 'Product 1',
          pricePerUnit: 10,
          totalPrice: 20,
        },
      ],
      userId: 1,
      nameTable: 'Table 1',
      email: 'test@example.com',
    };
    const expectedResult: CreateOrderResponse = {
      status: 201,
      errors: [],
      id: 1,
    };

    jest.spyOn(orderService, 'createOrder').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.createOrder(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call getOrder method', async () => {
    const payload: GetOrderRequest = { orderId: 1 };
    const expectedResult: GetOrderResponse = {
      status: 200,
      errors: [],
      order: {
        id: 1,
        userId: 1,
        table: {
          id: 1,
          name: 'Table 1',
          quantity: 4,
          state: 'available',
          activeOrderId: 1,
        },
        totalPrice: 20,
        items: [
          {
            productId: 1,
            quantity: 2,
            modifications: '',
            productName: 'Product 1',
            pricePerUnit: 10,
            totalPrice: 20,
          },
        ],
        user: { id: 1, name: 'test', email: 'test@test.com', role: 'admin' },
        email: 'test@test.com',
      },
    };

    jest.spyOn(orderService, 'getOrder').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.getOrder(payload.orderId));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call getAllOrders method', async () => {
    const expectedResult: GetAllOrdersResponse = {
      status: 200,
      errors: [],
      orders: [],
    };

    jest
      .spyOn(orderService, 'getAllOrders')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.getAllOrders());
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call deleteOrderItem method', async () => {
    const payload: DeleteOrderItemRequest = { orderId: 1, productId: 1 };
    const expectedResult: DeleteOrderItemResponse = { status: 200, errors: [] };

    jest
      .spyOn(orderService, 'deleteOrderItem')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(
      controller.deleteOrderItem(payload.orderId, payload.productId),
    );
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call updateOrder method', async () => {
    const payload: UpdateOrderRequest = {
      orderId: 1,
      products: [
        {
          productId: 1,
          quantity: 3,
          modifications: '',
          productName: 'Product 1',
          pricePerUnit: 10,
          totalPrice: 30,
        },
      ],
      userId: 1,
      nameTable: 'Table 1',
      email: 'test@example.com',
    };
    const expectedResult: UpdateOrderResponse = { status: 200, errors: [] };

    jest.spyOn(orderService, 'updateOrder').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(
      controller.updateOrder(payload.orderId, payload),
    );
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call createSale method', async () => {
    const payload: CreateSaleRequest = {
      userName: 'test',
      tableName: 'Table 1',
      date: '2023-01-01',
      tip: 5,
      totalPrice: 25,
      products: [
        {
          productId: 1,
          quantity: 2,
          modifications: '',
          productName: 'Product 1',
          pricePerUnit: 10,
          totalPrice: 20,
        },
      ],
      email: 'test@example.com',
    };
    const expectedResult: CreateSaleResponse = { status: 201, errors: [] };

    jest.spyOn(orderService, 'createSale').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.createSale(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call getAllSales method', async () => {
    const expectedResult: GetAllSalesResponse = {
      status: 200,
      errors: [],
      sales: [],
    };

    jest.spyOn(orderService, 'getAllSales').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.getAllSales());
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call getSalesByUser method', async () => {
    const payload: GetSalesByUserRequest = { userName: 'test' };
    const expectedResult: GetSalesByUserResponse = {
      status: 200,
      errors: [],
      sales: [],
    };

    jest
      .spyOn(orderService, 'getSalesByUser')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(
      controller.getSalesByUser(payload.userName),
    );
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call getSalesByDate method', async () => {
    const payload: GetSalesByDateRequest = { date: '2023-01-01' };
    const expectedResult: GetSalesByDateResponse = {
      status: 200,
      errors: [],
      sales: [],
    };

    jest
      .spyOn(orderService, 'getSalesByDate')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(
      controller.getSalesByDate(payload.date),
    );
    expect(result).toStrictEqual(expectedResult);
  });
});
