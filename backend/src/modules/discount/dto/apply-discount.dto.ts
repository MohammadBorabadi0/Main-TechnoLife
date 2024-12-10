import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ApplyDiscountDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsString()
  imageId: string;

  @IsNotEmpty()
  @IsUUID()
  discountId: string;
}
