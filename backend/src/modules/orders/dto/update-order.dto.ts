import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  orderCode?: string;

  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsBoolean()
  @IsOptional()
  isDelivered?: boolean;

  @IsDate()
  @IsOptional()
  paidAt?: Date;

  @IsDate()
  @IsOptional()
  deliveredAt?: Date;

  @IsNumber()
  @IsOptional()
  totalPrices?: number;

  @IsNumber()
  @IsOptional()
  totalPricesAfterDiscount?: number;

  @IsNumber()
  @IsOptional()
  shippingCost?: number;

  @IsNumber()
  @IsOptional()
  totalDiscountAmount?: number;
}
