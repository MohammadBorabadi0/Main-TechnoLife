// product.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Brand } from '@modules/brands/entities/brand.entity';
import { Image } from '@modules/product-images/entities/product-images.entity';
import { Attribute } from '@modules/product-attributes/entities/product-attributes.entity';
import { Color } from '@modules/colors/entities/color.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { generateUniqueSlug } from 'src/utils/slug.utils';
import { UpdateProductDto } from './dto/update-product.dto';
import { Discount } from '@modules/discount/entities/discount.entity';
import { DiscountType } from '@modules/discount/enums/discount-enums';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
    @InjectRepository(Attribute)
    private readonly attributesRepository: Repository<Attribute>,
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  private async calculateFinalPrice(image: Image): Promise<number> {
    let finalPrice = image.price; // شروع با قیمت اصلی تصویر

    if (image.discount && image.discount.isActive) {
      // اعمال تخفیف‌ها
      finalPrice = this.applyDiscount(finalPrice, image.discount);
    }

    // به‌روزرسانی قیمت نهایی در فیلد finalPrice تصویر
    return finalPrice;
  }

  // تابع اعمال تخفیف
  private applyDiscount(price: number, discount: Discount): number {
    // اعمال تخفیف درصدی
    if (discount.type === DiscountType.PERCENTAGE) {
      return price - (price * discount.discountValue) / 100;
    }
    // اعمال تخفیف ثابت
    else if (discount.type === DiscountType.AMOUNT) {
      return price - discount.discountValue;
    }
    return price;
  }

  async applyDiscountToImage(
    imageId: string,
    discountId: string,
  ): Promise<Image> {
    // بازیابی تصویر مورد نظر
    const image = await this.imagesRepository.findOne({
      where: { id: imageId },
      relations: ['discount'],
    });

    if (!image) {
      throw new NotFoundException(`تصویر با شناسه ${imageId} یافت نشد.`);
    }

    // بازیابی تخفیف مورد نظر
    const discount = await this.productRepository.manager.findOne(Discount, {
      where: { id: discountId },
    });

    if (!discount) {
      throw new NotFoundException(`تخفیف با شناسه ${discountId} یافت نشد.`);
    }

    // اعمال تخفیف به تصویر
    image.discount = discount; // تخصیص تخفیف به تصویر
    image.finalPrice = await this.calculateFinalPrice(image); // محاسبه قیمت نهایی

    // ذخیره تغییرات در پایگاه داده
    return await this.imagesRepository.save(image);
  }

  // Check Exists Name
  async checkExistsName(
    name: string,
    id?: string,
  ): Promise<{ exists: boolean }> {
    const existingProduct = await this.productRepository.findOne({
      where: { name },
    });

    if (existingProduct && existingProduct.id !== id) {
      return { exists: true };
    }

    return { exists: false };
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Check if the exists product name
    const { exists } = await this.checkExistsName(createProductDto.name);

    if (exists) {
      throw new BadRequestException('محصول با این نام از قبل وجود دارد.');
    }

    // Check if the category exists
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.category },
    });

    if (!category) {
      throw new NotFoundException(
        `دسته‌بندی با شناسه ${createProductDto.category} یافت نشد.`,
      );
    }

    // Check if the brand exists
    const brand = await this.brandRepository.findOne({
      where: { id: createProductDto.brand },
    });
    if (!brand) {
      throw new NotFoundException(
        `برند با شناسه ${createProductDto.brand} یافت نشد.`,
      );
    }

    // Ensure images are provided
    if (!createProductDto.images || createProductDto.images.length === 0) {
      throw new BadRequestException('تصاویر محصول را وارد کنید.');
    }

    // Validate that the total stock in images matches the product stock
    const totalImageStock = createProductDto.images.reduce(
      (sum, imageDto) => sum + imageDto.stock,
      0,
    );

    if (totalImageStock !== createProductDto.stock) {
      throw new BadRequestException(
        `مجموع موجودی (${totalImageStock}) با موجودی اصلی محصول (${createProductDto.stock}) مطابقت ندارد.`,
      );
    }

    // Check for duplicate colors
    const colorIds = createProductDto.images.map((image) => image.color);
    const uniqueColorIds = new Set(colorIds);

    if (colorIds.length !== uniqueColorIds.size) {
      throw new BadRequestException(
        'رنگ‌های تکراری در بخش تصاویر مجاز نیستند.',
      );
    }

    // Save images to the database
    const images = await Promise.all(
      createProductDto.images.map(async (imageDto) => {
        // Check if the color exists
        const color = await this.colorRepository.findOne({
          where: { id: imageDto.color },
        });

        if (!color) {
          throw new NotFoundException(
            `رنگ با شناسه ${imageDto.color} یافت نشد.`,
          );
        }

        // Create and save the image entity
        const image = this.imagesRepository.create({
          ...imageDto,
          color: color.id,
        });
        return await this.imagesRepository.save(image);
      }),
    );

    // Create attribute entities
    const attributes = createProductDto.attributes.map((attributeDto) =>
      this.attributesRepository.create(attributeDto),
    );

    const slug = generateUniqueSlug(createProductDto.name);

    // Create and save the product entity
    const product = this.productRepository.create({
      ...createProductDto,
      slug,
      images,
      attributes,
      brand: brand.id,
      category: category.id,
    });

    return await this.productRepository.save(product);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<{
    products: Product[];
    totalPages: number;
    totalProducts: number;
  }> {
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    const searchQuery = search ? { name: Like(`%${search.trim()}%`) } : {};

    const [products, totalProducts] = await this.productRepository.findAndCount(
      {
        where: searchQuery,
        relations: ['images', 'attributes', 'images.discount'],
        skip,
        take: limit,
      },
    );

    // محاسبه قیمت تخفیف‌دار برای هر تصویر محصول
    for (const product of products) {
      for (const image of product.images) {
        image.finalPrice = await this.calculateFinalPrice(image); // محاسبه و ذخیره قیمت نهایی
      }
    }

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      totalPages,
      totalProducts,
    };
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException(`محصول با شناسه ${id} یافت نشد.`);
    }

    // محاسبه قیمت تخفیف‌دار برای هر تصویر محصول
    for (const image of product.images) {
      image.finalPrice = await this.calculateFinalPrice(image); // محاسبه و ذخیره قیمت نهایی
    }

    return product;
  }

  async findOneBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['images', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException(`محصول با شناسه ${slug} یافت نشد.`);
    }

    // محاسبه قیمت تخفیف‌دار برای هر تصویر محصول
    for (const image of product.images) {
      image.finalPrice = await this.calculateFinalPrice(image); // محاسبه و ذخیره قیمت نهایی
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Check if the product name is exists
    const { exists } = await this.checkExistsName(updateProductDto.name, id);

    if (exists) {
      throw new BadRequestException('محصول با این نام از قبل وجود دارد.');
    }

    // Check if the product exists
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException(`محصول با شناسه ${id} یافت نشد.`);
    }

    // Check if the category exists
    const category = await this.categoryRepository.findOne({
      where: { id: updateProductDto.category },
    });
    if (!category) {
      throw new NotFoundException(
        `دسته‌بندی با شناسه ${updateProductDto.category} یافت نشد.`,
      );
    }

    // Check if the brand exists
    const brand = await this.brandRepository.findOne({
      where: { id: updateProductDto.brand },
    });
    if (!brand) {
      throw new NotFoundException(
        `برند با شناسه ${updateProductDto.brand} یافت نشد.`,
      );
    }

    // Ensure images are provided
    if (!updateProductDto.images || updateProductDto.images.length === 0) {
      throw new BadRequestException('تصاویر محصول را وارد کنید.');
    }

    // Validate that the total stock in images matches the product stock
    const totalImageStock = updateProductDto.images.reduce(
      (sum, imageDto) => sum + imageDto.stock,
      0,
    );

    if (totalImageStock !== updateProductDto.stock) {
      throw new BadRequestException(
        `مجموع موجودی (${totalImageStock}) با موجودی اصلی محصول (${updateProductDto.stock}) مطابقت ندارد.`,
      );
    }

    // Check for duplicate colors
    const colorIds = updateProductDto.images.map((image) => image.color);
    const uniqueColorIds = new Set(colorIds);

    if (colorIds.length !== uniqueColorIds.size) {
      throw new BadRequestException(
        'رنگ‌های تکراری در بخش تصاویر مجاز نیستند.',
      );
    }

    // Save images to the database
    const images = await Promise.all(
      updateProductDto.images.map(async (imageDto) => {
        // Check if the color exists
        const color = await this.colorRepository.findOne({
          where: { id: imageDto.color },
        });

        if (!color) {
          throw new NotFoundException(
            `رنگ با شناسه ${imageDto.color} یافت نشد.`,
          );
        }

        // Create and save the image entity
        const image = this.imagesRepository.create({
          ...imageDto,
          color: color.id,
        });
        return await this.imagesRepository.save(image);
      }),
    );

    // Create attribute entities
    const attributes = updateProductDto.attributes.map((attributeDto) =>
      this.attributesRepository.create(attributeDto),
    );

    const slug = generateUniqueSlug(product.name);

    // Update the product entity
    Object.assign(product, {
      ...updateProductDto,
      slug,
      images,
      attributes,
      brand: brand.id,
      category: category.id,
    });

    return await this.productRepository.save(product);
  }

  async updateStatus(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Check if the product exists
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['images', 'attributes'],
    });
    if (!product) {
      throw new NotFoundException(`محصول با شناسه ${id} یافت نشد.`);
    }

    product.isActive = updateProductDto.isActive;
    await this.productRepository.update(id, updateProductDto);

    return this.productRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOneById(id);

    if (!product) {
      throw new NotFoundException(`محصول با شناسه ${id} یافت نشد.`);
    }

    await this.productRepository.remove(product);
  }
}
