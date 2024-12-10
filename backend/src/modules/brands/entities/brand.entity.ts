import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CategoryBrand } from './category-brand.entity';
import { Product } from '@modules/products/entities/product.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  // Define OneToMany relation for categoryBrands
  @OneToMany(() => CategoryBrand, (categoryBrand) => categoryBrand.brand, {
    cascade: true,
  })
  categoryBrands: CategoryBrand[];

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
