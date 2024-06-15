import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';
import { OrderController } from './order/order.controller';
import { ProductController } from './product/product.controller';
import { AUTH_SERVICE_NAME } from './auth/auth.pb';
import { ORDER_SERVICE_NAME } from './order/order.pb';
import { PRODUCT_SERVICE_NAME } from './product/product.pb';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.AUTH_SERVICE_URL,
          package: 'auth',
          protoPath: join(__dirname, '../node_modules/grpc-nest-proto/proto/auth.proto'),
        },
      },
      {
        name: ORDER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.ORDER_SERVICE_URL,
          package: 'order',
          protoPath: join(__dirname, '../node_modules/grpc-nest-proto/proto/order.proto'),
        },
      },
      {
        name: PRODUCT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.PRODUCT_SERVICE_URL,
          package: 'product',
          protoPath: join(__dirname, '../node_modules/grpc-nest-proto/proto/product.proto'),
        },
      },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController, OrderController, ProductController],
})
export class AppModule {}
