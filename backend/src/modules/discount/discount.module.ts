import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { Product } from '@modules/products/entities/product.entity';
import { Image } from '@modules/product-images/entities/product-images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discount, Product, Image])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
