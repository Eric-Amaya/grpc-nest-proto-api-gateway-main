import { Controller, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ProductServiceClient, PRODUCT_SERVICE_NAME, CreateProductRequest, FindOneRequest, DecreaseStockRequest } from './product.pb';
import { Body, Get, Param, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('products')
export class ProductController {
  private productService: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.productService = this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Post()
  @Auth(Role.ADMIN)
  createProduct(@Body() request: CreateProductRequest): Observable<any> {
    return this.productService.createProduct(request);
  }

  @Get(':id')
  @Auth(Role.ADMIN)
  findOne(@Param('id') id: number): Observable<any> {
    const request: FindOneRequest = { id };
    return this.productService.findOne(request);
  }

  @Post('decrease-stock')
  @Auth(Role.ADMIN)
  decreaseStock(@Body() request: DecreaseStockRequest): Observable<any> {
    return this.productService.decreaseStock(request);
  }
}
