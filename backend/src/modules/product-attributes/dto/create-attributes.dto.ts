import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  option: string;

  @IsEnum(['string', 'boolean'], {
    message: 'optionType must be either "string" or "boolean"',
  })
  @IsNotEmpty()
  optionType: 'string' | 'boolean';
}
