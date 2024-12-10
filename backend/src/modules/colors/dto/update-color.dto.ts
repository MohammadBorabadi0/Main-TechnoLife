import { PartialType } from '@nestjs/mapped-types';
import { CreateColorDto } from './create-color.dto';

export class UpdateColorDto extends PartialType(CreateColorDto) {}
