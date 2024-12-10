import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsDate,
  IsObject,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItem } from '../entities/order-item.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => OrderItem)
  orderItems: OrderItem[];

  @IsString()
  @IsNotEmpty()
  orderCode: string;

  @IsString()
  @IsNotEmpty()
  trackingNumber: string;

  @IsObject()
  shippingAddress: object;

  @IsObject()
  @IsOptional()
  paymentResult?: object;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsString()
  @IsNotEmpty()
  sendCompany: string;

  @IsNumber()
  @IsNotEmpty()
  totalPrices: number;

  @IsNumber()
  @IsNotEmpty()
  totalPricesAfterDiscount: number;

  @IsNumber()
  @IsNotEmpty()
  shippingCost: number;

  @IsNumber()
  @IsNotEmpty()
  totalDiscountAmount: number;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean = false;

  @IsBoolean()
  @IsOptional()
  isDelivered?: boolean = false;

  @IsDate()
  @IsOptional()
  paidAt?: Date;

  @IsDate()
  @IsOptional()
  deliveredAt?: Date;
}
