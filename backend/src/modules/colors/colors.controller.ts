import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  // Check Exists Name
  @Post('exists-name')
  async checkExistsName(@Body() body: { name: string; id?: string }) {
    const { name, id } = body;
    const result = await this.colorsService.checkExistsName(name, id);
    return result;
  }

  // Check Exists Code
  @Post('exists-code')
  async checkExistsCode(@Body() body: { code: string; id?: string }) {
    const { code, id } = body;
    const result = await this.colorsService.checkExistsCode(code, id);
    return result;
  }

  @Post()
  create(@Body() createColorDto: CreateColorDto) {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.colorsService.findAllColors(+page, +limit, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colorsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    return this.colorsService.update(id, updateColorDto);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.colorsService.updateStatus(id, updateColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorsService.remove(id);
  }
}
