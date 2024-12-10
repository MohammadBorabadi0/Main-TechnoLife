import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AttributesService } from './product-attributes.service';
import { CreateAttributeDto } from './dto/create-attributes.dto';

@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Post()
  create(@Body() createAttributeDto: CreateAttributeDto) {
    return this.attributesService.create(createAttributeDto);
  }

  @Get()
  findAll() {
    return this.attributesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.remove(id);
  }
}
