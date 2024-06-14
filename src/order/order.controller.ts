import { Controller, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { OrderServiceClient, ORDER_SERVICE_NAME, CreateOrderRequest, GetOrderRequest, GetAllOrdersRequest, CreateTableRequest, GetTablesByNameRequest, GetAllTablesRequest, UpdateTableStateRequest, CreateSaleRequest, GetAllSalesRequest, GetSalesByUserRequest, GetSalesByDateRequest } from './order.pb';
import { Observable } from 'rxjs';
import { Body, Get, Param, Post } from '@nestjs/common';
import { Auth } from '../common/decorators/auth.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('orders')
export class OrderController {
  private orderService: OrderServiceClient;

  @Inject(ORDER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  onModuleInit() {
    this.orderService = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post('tables/create')
  @Auth(Role.USER)
  createTable(@Body() request:  CreateTableRequest): Observable<any> {
    return this.orderService.createTable(request);
  }

  @Get('tables/name')
  @Auth(Role.USER)
  getTablesByName(@Body() request:  GetTablesByNameRequest): Observable<any> {
    return this.orderService.getTablesByName(request);
  }

  @Get('tables')
  @Auth(Role.USER)
  getAllTables(@Body() request:  GetAllTablesRequest): Observable<any> {
    return this.orderService.getAllTables(request);
  }

  @Post('tables/update')
  @Auth(Role.USER)
  updateTableState(@Body() request:  UpdateTableStateRequest): Observable<any> {
    return this.orderService.updateTableState(request);
  }

  @Post('create')
  @Auth(Role.USER)
  createOrder(@Body() request: CreateOrderRequest): Observable<any> {
    return this.orderService.createOrder(request);
  }

  @Get(':id')
  @Auth(Role.USER)
  getOrder(@Param('id') id: number): Observable<any> {
    const request: GetOrderRequest = { orderId: id };
    return this.orderService.getOrder(request);
  }

  @Get('')
  @Auth(Role.USER)
  getAllOrders(): Observable<any> {
    const request: GetAllOrdersRequest = {};
    return this.orderService.getAllOrders(request);
  }

  @Post('sales/create')
  @Auth(Role.USER)
  createSale(@Body() request: CreateSaleRequest): Observable <any> {
    return this.orderService.createSale(request);
  }

  @Get('sales/all')
  @Auth(Role.USER)
  getAllSales(): Observable <any> {
    const request: GetAllSalesRequest = {};
    return this.orderService.getAllSales(request);
  }

  @Get('sales/user')
  @Auth(Role.USER)
  getSalesByUser(@Body() request: GetSalesByUserRequest): Observable <any> {
    return this.orderService.getSalesByUser(request);
  }

  @Get('sales/date')
  @Auth(Role.USER)
  getSalesByDate(@Body() request: GetSalesByDateRequest): Observable <any> {
    return this.orderService.getSalesByDate(request);
  }
}
