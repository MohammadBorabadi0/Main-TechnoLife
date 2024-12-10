// src/brand/brand.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { BrandService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from './entities/brand.entity';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // Check Exists Name
  @Post('exists')
  async checkExistsName(@Body() body: { name: string; id?: string }) {
    const { name, id } = body;
    const result = await this.brandService.checkExistsName(name, id);
    return result;
  }

  @Post()
  async create(@Body() createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.brandService.findAllBrands(+page, +limit, search);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Brand> {
    return this.brandService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<Brand> {
    return this.brandService.update(id, updateBrandDto);
  }

  @Delete(':id')
  async deleteBrand(@Param('id') id: string): Promise<{ message: string }> {
    console.log({ id });
    const message = await this.brandService.deleteBrand(id);
    return { message };
  }
}
