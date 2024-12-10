// order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @Column({ type: 'varchar', length: 255, unique: true })
  orderCode: string;

  @Column({ type: 'varchar', length: 255 })
  trackingNumber: string;

  @Column('json', { nullable: false })
  shippingAddress: object;

  @Column('json', { nullable: true })
  paymentResult: object;

  @Column({ type: 'varchar', length: 100 })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 100 })
  sendCompany: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  totalPrices: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  totalPricesAfterDiscount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  totalDiscountAmount: number;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'datetime', nullable: true })
  paidAt: Date;

  @Column({ type: 'boolean', default: false })
  isDelivered: boolean;

  @Column({ type: 'datetime', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
