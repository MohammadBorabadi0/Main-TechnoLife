import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateImageDto } from '@modules/product-images/dto/create-image.dto';
import { CreateAttributeDto } from '@modules/product-attributes/dto/create-attributes.dto';

export class CreateProductDto {
  @IsString({ message: 'نام باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'نام نمی‌تواند خالی باشد.' })
  name: string;

  @IsString({ message: 'توضیحات باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'توضیحات نمی‌تواند خالی باشد.' })
  description: string;

  @IsNumber({}, { message: 'قیمت پایه باید یک عدد باشد.' })
  @IsNotEmpty({ message: 'قیمت پایه نمی‌تواند خالی باشد.' })
  basePrice: number;

  @IsNumber({}, { message: 'موجودی باید یک عدد باشد.' })
  @IsNotEmpty({ message: 'موجودی نمی‌تواند خالی باشد.' })
  stock: number;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @IsString({ message: 'دسته‌بندی باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'دسته‌بندی نمی‌تواند خالی باشد.' })
  category: string;

  @IsString({ message: 'برند باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'برند نمی‌تواند خالی باشد.' })
  brand: string;

  @IsArray({ message: 'تصاویر باید یک آرایه باشد.' })
  @ValidateNested({ each: true, message: 'هر تصویر باید معتبر باشد.' })
  @Type(() => CreateImageDto)
  images: CreateImageDto[];

  @IsArray({ message: 'ویژگی‌ها باید یک آرایه باشد.' })
  @ValidateNested({ each: true, message: 'هر ویژگی باید معتبر باشد.' })
  @Type(() => CreateAttributeDto)
  attributes: CreateAttributeDto[];
}
