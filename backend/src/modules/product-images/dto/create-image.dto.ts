import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateImageDto {
  @IsString({ message: 'آدرس تصویر باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'آدرس تصویر نمی‌تواند خالی باشد.' })
  imageUrl: string;

  @IsNumber({}, { message: 'قیمت باید یک عدد باشد.' })
  @IsNotEmpty({ message: 'قیمت نمی‌تواند خالی باشد.' })
  price: number;

  @IsNumber({}, { message: 'موجودی باید یک عدد باشد.' })
  @IsNotEmpty({ message: 'موجودی نمی‌تواند خالی باشد.' })
  stock: number;

  @IsString({ message: 'رنگ باید یک رشته باشد.' })
  @IsNotEmpty({ message: 'رنگ نمی‌تواند خالی باشد.' })
  color: string;
}
