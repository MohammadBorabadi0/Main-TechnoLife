import { Module } from '@nestjs/common';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
