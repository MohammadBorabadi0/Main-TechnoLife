import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entities/product-attributes.entity';
import { CreateAttributeDto } from './dto/create-attributes.dto';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) {}

  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    const attribute = this.attributeRepository.create(createAttributeDto);
    return await this.attributeRepository.save(attribute);
  }

  async findAll(): Promise<Attribute[]> {
    return await this.attributeRepository.find({ relations: ['product'] });
  }

  async findOne(id: string): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['product'],
    });
    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${id} not found`);
    }
    return attribute;
  }

  async remove(id: string): Promise<void> {
    const attribute = await this.findOne(id);
    await this.attributeRepository.remove(attribute);
  }
}
