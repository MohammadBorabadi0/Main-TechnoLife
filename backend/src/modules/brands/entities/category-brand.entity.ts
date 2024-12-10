// src/brand/entities/category-brand.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from '@modules/categories/entities/category.entity';

@Entity('category_brands')
export class CategoryBrand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Brand, (brand) => brand.categoryBrands)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @ManyToOne(() => Category, (category) => category.categoryBrands, {
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({ type: 'boolean', default: false })
  isBest: boolean;
}
