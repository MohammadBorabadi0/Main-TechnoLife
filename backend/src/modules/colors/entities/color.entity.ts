import { OrderItem } from '@modules/orders/entities/order-item.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Color {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product) // Relation with order items
  orderItems: OrderItem[];
}
