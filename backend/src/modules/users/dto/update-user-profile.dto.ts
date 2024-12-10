import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  Matches,
  Length,
} from 'class-validator';

export class UpdateUserProfileDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('IR')
  mobile?: string;

  @IsOptional()
  @Length(16)
  cardNumber?: string;

  @IsOptional()
  @Matches(/^\d{10}$/)
  nationalCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;
}
