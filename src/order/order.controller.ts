import { Controller, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { OrderServiceClient, ORDER_SERVICE_NAME, CreateOrderRequest, GetOrderRequest, GetAllOrdersRequest } from './order.pb';
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

  @Post()
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

  @Get()
  @Auth(Role.USER)
  getAllOrders(): Observable<any> {
    const request: GetAllOrdersRequest = {};
    return this.orderService.getAllOrders(request);
  }
}
