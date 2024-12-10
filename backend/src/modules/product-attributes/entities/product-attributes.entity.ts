import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '@modules/products/entities/product.entity';

@Entity('product-attributes')
export class Attribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  option: string;

  @Column({
    type: 'enum',
    enum: ['string', 'boolean'],
    default: 'string',
  })
  optionType: 'string' | 'boolean';

  @ManyToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
