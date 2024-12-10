import { IsString, IsUrl, IsOptional, IsBoolean } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  name: string;

  @IsUrl()
  imageUrl: string;

  @IsUrl()
  @IsOptional()
  mobileImageUrl?: string;

  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  selectedLocationBanner?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
