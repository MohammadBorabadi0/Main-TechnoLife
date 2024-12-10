// src/brand/brand.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CategoryBrand } from './entities/category-brand.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Product } from '@modules/products/entities/product.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(CategoryBrand)
    private readonly categoryBrandRepository: Repository<CategoryBrand>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Check Exists Name
  async checkExistsName(
    name: string,
    id?: string,
  ): Promise<{ exists: boolean }> {
    const existingBrand = await this.brandRepository.findOne({
      where: { name },
    });

    if (existingBrand && existingBrand.id !== id) {
      return { exists: true };
    }

    return { exists: false };
  }

  async create(createBrandDto: CreateBrandDto) {
    console.log({ createBrandDto });

    // Check if a brand with the same name already exists
    const { exists } = await this.checkExistsName(createBrandDto.name);

    if (exists) {
      throw new ConflictException(
        `برند با نام "${createBrandDto.name}" از قبل وجود دارد.`,
      );
    }

    const categoryBrands = [];

    // بررسی هر دسته‌بندی و اضافه کردن آن
    for (const cat of createBrandDto.categories) {
      // بررسی اینکه آیا دسته‌بندی با این id در پایگاه داده موجود است
      const category = await this.categoryRepository.findOne({
        where: { id: cat.categoryId },
      });

      // اگر دسته‌بندی پیدا نشد، خطا می‌دهیم
      if (!category) {
        throw new NotFoundException(
          `دسته بندی با شناسه ${cat.categoryId} پیدا نشد.`,
        );
      }

      // اضافه کردن دسته‌بندی به لیست categoryBrands
      const categoryBrand = new CategoryBrand();
      categoryBrand.category = category;
      categoryBrand.isBest = cat.isBest;
      categoryBrand.imageUrl = cat.imageUrl;

      categoryBrands.push(categoryBrand);
    }

    // اگر هیچ دسته‌بندی معتبر پیدا نشد، برند را ایجاد نکنید
    if (categoryBrands.length === 0) {
      throw new NotFoundException('No valid categories provided.');
    }

    // ایجاد برند جدید
    const brand = new Brand();
    brand.name = createBrandDto.name;

    // ذخیره‌سازی برند در پایگاه داده
    await this.brandRepository.save(brand);

    // تخصیص برند به دسته‌بندی‌ها
    for (const categoryBrand of categoryBrands) {
      categoryBrand.brand = brand;
    }

    // ذخیره‌سازی دسته‌بندی‌ها برای برند
    await this.categoryBrandRepository.save(categoryBrands);

    return brand;
  }

  // دریافت همه برندها به همراه دسته‌بندی‌ها
  async findAllBrands(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<{ brands: Brand[]; totalPages: number; totalBrands: number }> {
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    // Build the search query for brand name
    const searchQuery = search ? { name: Like(`%${search.trim()}%`) } : {};

    // Fetch brands with pagination and search
    const [brands, totalBrands] = await this.brandRepository.findAndCount({
      where: searchQuery,
      relations: ['categoryBrands', 'categoryBrands.category'],
      skip,
      take: limit,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalBrands / limit);

    return {
      brands,
      totalPages,
      totalBrands,
    };
  }

  // Find brand by ID
  async findById(id: string) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['categoryBrands', 'categoryBrands.category'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found.`);
    }

    return brand;
  }

  // Update brand
  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['categoryBrands', 'categoryBrands.category'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found.`);
    }

    const { exists } = await this.checkExistsName(updateBrandDto.name, id);

    if (exists) {
      throw new ConflictException(
        `Brand with name "${updateBrandDto.name}" already exists.`,
      );
    }

    // Update brand fields
    brand.name = updateBrandDto.name || brand.name;

    // Check if categories need to be updated
    const updatedCategoryBrands = [];
    for (const cat of updateBrandDto.categories) {
      const category = await this.categoryRepository.findOne({
        where: { id: cat.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${cat.categoryId} not found.`,
        );
      }

      const categoryBrand = new CategoryBrand();
      categoryBrand.category = category;
      categoryBrand.isBest = cat.isBest;
      categoryBrand.imageUrl = cat.imageUrl;

      updatedCategoryBrands.push(categoryBrand);
    }

    if (updatedCategoryBrands.length > 0) {
      // Update categoryBrands for the brand
      brand.categoryBrands = updatedCategoryBrands;
    }

    // Save the updated brand and categoryBrands
    await this.brandRepository.save(brand);
    await this.categoryBrandRepository.save(updatedCategoryBrands);

    return brand;
  }

  async deleteBrand(id: string): Promise<string> {
    const products = await this.productRepository.find({
      where: { brand: id },
    });

    if (products.length > 0) {
      throw new ConflictException(
        'این برند به محصولات وابسته است و نمی‌توان آن را حذف کرد.',
      );
    }

    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['categoryBrands'],
    });

    if (!brand) {
      throw new NotFoundException(`برندی با شناسه ${id} پیدا نشد.`);
    }

    await this.categoryBrandRepository.delete({ brand: { id } });

    await this.brandRepository.delete(id);

    return `برند با نام ${brand.name} با موفقیت حذف شد.`;
  }
}
