import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandService } from './brands.service';
import { BrandController } from './brands.controller';
import { Brand } from './entities/brand.entity';
import { CategoryBrand } from './entities/category-brand.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { Product } from '@modules/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, CategoryBrand, Category, Product]),
  ],
  providers: [BrandService],
  controllers: [BrandController],
})
export class BrandModule {}
