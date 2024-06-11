import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_PACKAGE_NAME, PRODUCT_SERVICE_NAME } from './product.pb';
import { ProductController } from './product.controller';
import { AuthGuard } from '../guard/auth.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:5053',
          package: PRODUCT_PACKAGE_NAME,
          protoPath: 'node_modules/grpc-nest-proto/proto/product.proto',
        },
      },
    ]),
    AuthModule
  ],
  controllers: [ProductController],
  providers: [AuthGuard],
})
export class ProductModule {}