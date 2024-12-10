import { IsArray, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsArray()
  items?: {
    productId: number;
    quantity: number;
  }[];
}
