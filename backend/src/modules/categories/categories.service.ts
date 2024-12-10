import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Check Exists Name
  async checkExistsName(
    name: string,
    id?: string,
  ): Promise<{ exists: boolean }> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name },
    });

    if (existingCategory && existingCategory.id !== id) {
      return { exists: true };
    }

    return { exists: false };
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { exists } = await this.checkExistsName(createCategoryDto.name);

    if (exists) {
      throw new BadRequestException('دسته بندی با این نام از قبل وجود دارد.');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAllCategories(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    categories: Category[];
    totalPages: number;
    totalCategories: number;
  }> {
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    console.log({ skip, page, limit });

    // Build the search query
    const searchQuery = search ? { name: Like(`%${search.trim()}%`) } : {};

    // Fetch categories with pagination and search
    const [categories, totalCategories] =
      await this.categoryRepository.findAndCount({
        where: searchQuery,
        skip,
        take: limit,
      });

    // Calculate total pages based on total categories and limit
    const totalPages = Math.ceil(totalCategories / limit);

    return {
      categories,
      totalPages,
      totalCategories,
    };
  }

  async findCategoryById(id: string): Promise<Category> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    const { exists } = await this.checkExistsName(updateCategoryDto.name, id);

    if (exists) {
      throw new BadRequestException('Category with this name already exists.');
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async updateStatus(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`دسته بندی با شناسه ${id} پیدا نشد.`);
    }

    category.isActive = updateCategoryDto.isActive;
    await this.categoryRepository.update(id, updateCategoryDto);

    return this.categoryRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
