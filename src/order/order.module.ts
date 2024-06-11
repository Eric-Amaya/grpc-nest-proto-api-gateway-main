import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE_NAME, ORDER_PACKAGE_NAME } from './order.pb';
import { OrderController } from './order.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../guard/auth.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ORDER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:5052',
          package: ORDER_PACKAGE_NAME,
          protoPath: 'node_modules/grpc-nest-proto/proto/order.proto',
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [AuthGuard],
})
export class OrderModule {}