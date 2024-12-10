import { DiscountType } from '../enums/discount-enums';
import {
  IsNumber,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  ValidateIf,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  @ValidateIf((o) => o.type === DiscountType.PERCENTAGE)
  @Max(100) // فقط برای تخفیف درصدی
  @ValidateIf((o) => o.type === DiscountType.AMOUNT)
  @Min(0) // حداقل مقدار برای تخفیف ثابت
  discountValue: number;

  @IsEnum(DiscountType)
  type: DiscountType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumPurchase?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
