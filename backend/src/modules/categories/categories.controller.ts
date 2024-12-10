import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Check Exists Name
  @Post('exists')
  async checkExistsName(@Body() body: { name: string; id?: string }) {
    const { name, id } = body;
    const result = await this.categoryService.checkExistsName(name, id);
    return result;
  }

  @Post()
  //   @UseGuards(AdminGuard)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.categoryService.findAllCategories(+page, +limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findCategoryById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateStatus(id, updateCategoryDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
