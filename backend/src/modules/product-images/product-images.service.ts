import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '@modules/product-images/entities/product-images.entity';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const image = this.imageRepository.create(createImageDto);
    return await this.imageRepository.save(image);
  }

  async findAll(): Promise<Image[]> {
    return await this.imageRepository.find({ relations: ['product'] });
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);
    await this.imageRepository.remove(image);
  }
}
