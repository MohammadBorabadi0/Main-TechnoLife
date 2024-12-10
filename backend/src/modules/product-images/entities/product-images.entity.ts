import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '@modules/products/entities/product.entity';
import { Discount } from '@modules/discount/entities/discount.entity';

@Entity('product-images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ length: 50 })
  color: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  finalPrice: number;

  @ManyToOne(() => Discount, { nullable: true })
  discount: Discount;
}
