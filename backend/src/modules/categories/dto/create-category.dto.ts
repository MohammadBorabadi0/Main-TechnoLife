import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsUrl()
  iconUrl: string;

  @IsUrl()
  imageUrl: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsOptional()
  subCategories?: { name: string }[];
}
