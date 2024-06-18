import { Controller, Inject, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ProductServiceClient, PRODUCT_SERVICE_NAME, CreateProductRequest, FindOneRequest, DecreaseStockRequest, UpdateProductRequest, FindByCategoryRequest, FindAllRequest, FindByNameRequest, DeleteProductRequest } from './product.pb';
import { Body, Get, Param, Post , Delete} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../common/enums/role.enum';

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

  @Post('/product/update')
  @Auth(Role.ADMIN)
  updateProduct(@Body() request: UpdateProductRequest) : Observable<any> {
    return this.productService.updateProduct(request);
  }

  @Get('/product/category')
  @Auth(Role.USER)
  findByCategory(@Query('category') category: string): Observable<any>{
    const request: FindByCategoryRequest = {category: category};
    return this.productService.findByCategory(request);
  }

  @Get('/product/all')
  @Auth(Role.USER)
  findAll(): Observable<any> {
    const request: FindAllRequest = {};
    return this.productService.findAll(request);
  }

  @Get('/product/name')
  @Auth(Role.USER)
  findByName(@Query('name') name: string): Observable<any> {
    const request: FindByNameRequest = {name:name}
    return this.productService.findByName(request);
  }

  @Delete('delete/:id')
  @Auth(Role.ADMIN)
  deleteProduct(@Param('id') id:number): Observable<any> {
    const request: DeleteProductRequest = {id:id};
    return this.productService.deleteProduct(request);
  }

}
