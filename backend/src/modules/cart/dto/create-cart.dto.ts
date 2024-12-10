import { IsNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsArray()
  items: {
    productId: number;
    quantity: number;
  }[];
}
