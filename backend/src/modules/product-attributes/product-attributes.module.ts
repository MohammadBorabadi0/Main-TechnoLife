import { Module } from '@nestjs/common';
import { AttributesController } from './product-attributes.controller';
import { AttributesService } from './product-attributes.service';

@Module({
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class ProductAttributesModule {}
