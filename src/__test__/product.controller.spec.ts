import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product/product.controller';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ProductServiceClient,
  PRODUCT_SERVICE_NAME,
  CreateProductRequest,
  CreateProductResponse,
  FindOneRequest,
  FindOneResponse,
  DecreaseStockRequest,
  DecreaseStockResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  FindByCategoryRequest,
  FindByCategoryResponse,
  FindAllRequest,
  FindAllResponse,
  FindByNameRequest,
  FindByNameResponse,
  DeleteProductRequest,
  DeleteProductResponse,
} from '../product/product.pb';
import { firstValueFrom, of } from 'rxjs';
import { AuthGuard } from '../guard/auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

describe('ProductController (Gateway)', () => {
  let controller: ProductController;
  let client: ClientGrpc;
  let productService: ProductServiceClient;

  const mockProductServiceClient = {
    createProduct: jest
      .fn()
      .mockReturnValue(of({ status: 201, error: [], id: 1 })),
    findOne: jest.fn().mockReturnValue(
      of({
        status: 200,
        error: [],
        data: {
          id: 1,
          name: 'Product 1',
          sku: 'SKU1',
          stock: 100,
          price: 10,
          category: 'Category 1',
          description: 'Description 1',
        },
      }),
    ),
    decreaseStock: jest.fn().mockReturnValue(of({ status: 200, error: [] })),
    updateProduct: jest.fn().mockReturnValue(
      of({
        status: 200,
        error: [],
        updatedProduct: {
          id: 1,
          name: 'Product 1 Updated',
          sku: 'SKU1',
          stock: 90,
          price: 15,
          category: 'Category 1',
          description: 'Description 1 Updated',
        },
      }),
    ),
    findByCategory: jest
      .fn()
      .mockReturnValue(of({ status: 200, error: [], products: [] })),
    findAll: jest
      .fn()
      .mockReturnValue(of({ status: 200, error: [], products: [] })),
    findByName: jest
      .fn()
      .mockReturnValue(of({ status: 200, error: [], products: [] })),
    deleteProduct: jest.fn().mockReturnValue(of({ status: 200, error: [] })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: PRODUCT_SERVICE_NAME,
          useValue: {
            getService: jest.fn().mockReturnValue(mockProductServiceClient),
          },
        },
        {
          provide: 'ClientGrpc',
          useValue: {
            getService: jest.fn().mockReturnValue(mockProductServiceClient),
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

    controller = module.get<ProductController>(ProductController);
    client = module.get<ClientGrpc>('ClientGrpc');
    productService =
      client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);

    controller.onModuleInit();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createProduct method', async () => {
    const payload: CreateProductRequest = {
      name: 'Product 1',
      sku: 'SKU1',
      stock: 100,
      price: 10,
      category: 'Category 1',
      description: 'Description 1',
    };
    const expectedResult: CreateProductResponse = {
      status: 201,
      error: [],
      id: 1,
    };

    jest
      .spyOn(productService, 'createProduct')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.createProduct(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call findOne method', async () => {
    const payload: FindOneRequest = { id: 1 };
    const expectedResult: FindOneResponse = {
      status: 200,
      error: [],
      data: {
        id: 1,
        name: 'Product 1',
        sku: 'SKU1',
        stock: 100,
        price: 10,
        category: 'Category 1',
        description: 'Description 1',
      },
    };

    jest.spyOn(productService, 'findOne').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.findOne(payload.id));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call decreaseStock method', async () => {
    const payload: DecreaseStockRequest = { id: 1, orderId: 1 };
    const expectedResult: DecreaseStockResponse = { status: 200, error: [] };

    jest
      .spyOn(productService, 'decreaseStock')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.decreaseStock(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call updateProduct method', async () => {
    const payload: UpdateProductRequest = {
      productId: 1,
      product: {
        id: 1,
        name: 'Product 1 Updated',
        sku: 'SKU1',
        stock: 90,
        price: 15,
        category: 'Category 1',
        description: 'Description 1 Updated',
      },
    };
    const expectedResult: UpdateProductResponse = {
      status: 200,
      error: [],
      updatedProduct: {
        id: 1,
        name: 'Product 1 Updated',
        sku: 'SKU1',
        stock: 90,
        price: 15,
        category: 'Category 1',
        description: 'Description 1 Updated',
      },
    };

    jest
      .spyOn(productService, 'updateProduct')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.updateProduct(payload));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call findByCategory method', async () => {
    const payload: FindByCategoryRequest = { category: 'Category 1' };
    const expectedResult: FindByCategoryResponse = {
      status: 200,
      error: [],
      products: [],
    };

    jest
      .spyOn(productService, 'findByCategory')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(
      controller.findByCategory(payload.category),
    );
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call findAll method', async () => {
    const expectedResult: FindAllResponse = {
      status: 200,
      error: [],
      products: [],
    };

    jest.spyOn(productService, 'findAll').mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.findAll());
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call findByName method', async () => {
    const payload: FindByNameRequest = { name: 'Product 1' };
    const expectedResult: FindByNameResponse = {
      status: 200,
      error: [],
      products: [],
    };

    jest
      .spyOn(productService, 'findByName')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.findByName(payload.name));
    expect(result).toStrictEqual(expectedResult);
  });

  it('should call deleteProduct method', async () => {
    const payload: DeleteProductRequest = { id: 1 };
    const expectedResult: DeleteProductResponse = { status: 200, error: [] };

    jest
      .spyOn(productService, 'deleteProduct')
      .mockReturnValue(of(expectedResult));

    const result = await firstValueFrom(controller.deleteProduct(payload.id));
    expect(result).toStrictEqual(expectedResult);
  });
});
