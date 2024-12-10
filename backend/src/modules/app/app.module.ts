import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@modules/database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ColorsModule } from '@modules/colors/colors.module';
import { CategoryModule } from '@modules/categories/categories.module';
import { BannersModule } from '@modules/banners/banners.module';
import { ProductModule } from '@modules/products/products.module';
import { BrandModule } from '@modules/brands/brands.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { DiscountModule } from '@modules/discount/discount.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    ColorsModule,
    CategoryModule,
    BannersModule,
    ProductModule,
    BrandModule,
    OrdersModule,
    DiscountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
