import { Module } from '@nestjs/common';
import { BannerService } from './banners.service';
import { BannerController } from './banners.controller';
import { Banner } from './entities/banner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannersModule {}
