// src/brand/dto/create-brand.dto.ts
import { IsString, IsArray } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsArray()
  categories: {
    categoryId: string;
    isBest: boolean;
    imageUrl: string;
  }[];
}
