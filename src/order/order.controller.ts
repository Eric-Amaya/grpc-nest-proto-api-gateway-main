import { Controller, Inject, Query } from '@nestjs/common';
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
  @Auth(Role.ADMIN)
  createTable(@Body() request: CreateTableRequest): Observable<any> {
    return this.orderService.createTable(request);
  }

  @Get('tables/name')
  @Auth(Role.USER)
  getTablesByName(@Query('name') name: string): Observable<any> {
      const request: GetTablesByNameRequest = { name: name };
      return this.orderService.getTablesByName(request);
  }

  @Get('tables')
  @Auth(Role.USER)
  getAllTables(): Observable<any> {
    const request: GetAllTablesRequest = {};
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
  @Auth(Role.ADMIN)
  getAllSales(): Observable <any> {
    const request: GetAllSalesRequest = {};
    return this.orderService.getAllSales(request);
  }

  @Get('sales/user')
  @Auth(Role.ADMIN)
  getSalesByUser(@Query('user') userName: string): Observable <any> {
    const request: GetSalesByUserRequest = {userName: userName};
    return this.orderService.getSalesByUser(request);
  }

  @Get('sales/date')
  @Auth(Role.ADMIN)
  getSalesByDate(@Query('date') date: string): Observable <any> {
    const request: GetSalesByDateRequest = {date:date};
    return this.orderService.getSalesByDate(request);
  }
}
