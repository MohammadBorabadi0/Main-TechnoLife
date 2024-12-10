import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsHexColor,
} from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsHexColor()
  code: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;
}
