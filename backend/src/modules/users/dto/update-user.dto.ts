import { Transform } from 'class-transformer';
import { IsEmail, IsBoolean, IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsBoolean()
  @Transform(({ value }) => (value === undefined ? false : value))
  isAdmin: boolean;
}
