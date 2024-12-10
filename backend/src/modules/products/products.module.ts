import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Brand } from '@modules/brands/entities/brand.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Color } from '@modules/colors/entities/color.entity';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { Image } from '@modules/product-images/entities/product-images.entity';
import { Attribute } from '@modules/product-attributes/entities/product-attributes.entity';
import { OrderItem } from '@modules/orders/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Image,
      Attribute,
      Brand,
      Category,
      Color,
      OrderItem,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
