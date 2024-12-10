import { Module } from '@nestjs/common';
import { ImagesController } from './product-images.controller';
import { ImagesService } from './product-images.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ProductImagesModule {}
