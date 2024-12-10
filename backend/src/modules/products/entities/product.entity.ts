import { OrderItem } from '@modules/orders/entities/order-item.entity';
import { Attribute } from '@modules/product-attributes/entities/product-attributes.entity';
import { Image } from '@modules/product-images/entities/product-images.entity';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  basePrice: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 100 })
  brand: string;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images: Image[];

  @OneToMany(() => Attribute, (attribute) => attribute.product, {
    cascade: true,
  })
  attributes: Attribute[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @Column({ unique: true })
  slug: string;
}
