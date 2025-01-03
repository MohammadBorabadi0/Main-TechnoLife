// category.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubCategory } from './sub-category.entity';
import { CategoryBrand } from '@modules/brands/entities/category-brand.entity'; // import CategoryBrand
import { Product } from '@modules/products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  iconUrl: string;

  @Column({ type: 'varchar' })
  imageUrl: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.category, {
    cascade: true,
    eager: true,
  })
  subCategories: SubCategory[];

  @OneToMany(() => CategoryBrand, (categoryBrand) => categoryBrand.category)
  categoryBrands: CategoryBrand[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
