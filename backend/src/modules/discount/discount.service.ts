import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { Discount } from './entities/discount.entity';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';
import { Product } from '@modules/products/entities/product.entity';
import { Image } from '@modules/product-images/entities/product-images.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  // Check Exists Name
  async checkExistsName(
    name: string,
    id?: string,
  ): Promise<{ exists: boolean }> {
    const existingDiscount = await this.discountRepository.findOne({
      where: { name },
    });

    if (existingDiscount && existingDiscount.id !== id) {
      return { exists: true };
    }

    return { exists: false };
  }

  async applyDiscount(applyDiscountDto: ApplyDiscountDto): Promise<any> {
    const { productId, imageId, discountId } = applyDiscountDto;

    // پیدا کردن محصول
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['images'],
    });
    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    // پیدا کردن تصویر
    const image = product.images.find((img) => img.id === imageId);
    if (!image) {
      throw new NotFoundException(`تصویری با شناسه ${imageId} یافت نشد`);
    }

    // اگر شناسه تخفیف داده شده باشد، پیدا کردن تخفیف
    let discount: Discount | undefined;
    if (discountId) {
      discount = await this.discountRepository.findOne({
        where: { id: discountId },
      });
      if (!discount) {
        throw new NotFoundException('تخفیف یافت نشد');
      }
    }

    // اعمال تخفیف به تصویر
    if (discount) {
      image.discount = discount;
      image.finalPrice = image.price - discount.discountValue;
      await this.imageRepository.save(image);
      return { message: 'تخفیف با موفقیت اعمال شد' };
    } else {
      throw new BadRequestException('تخفیف معتبر انتخاب نشده است');
    }
  }

  async create(dto: CreateDiscountDto): Promise<Discount> {
    const discount = this.discountRepository.create(dto);
    return await this.discountRepository.save(discount);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<{ discounts: Discount[]; totalPages: number }> {
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    const searchQuery = search ? { name: Like(`%${search.trim()}%`) } : {};

    // Fetch discounts with search and pagination
    const [discounts, totalCount] = await this.discountRepository.findAndCount({
      where: searchQuery,
      skip,
      take: limit,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    return { discounts, totalPages };
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) throw new NotFoundException('Discount not found');
    return discount;
  }

  async update(id: string, dto: UpdateDiscountDto): Promise<Discount> {
    const discount = await this.findOne(id);
    Object.assign(discount, dto);
    return await this.discountRepository.save(discount);
  }

  async updateStatus(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    // Check if the product exists
    const discount = await this.discountRepository.findOne({
      where: { id },
    });
    if (!discount) {
      throw new NotFoundException(`تخفیف با شناسه ${id} یافت نشد.`);
    }

    console.log('UPDATE_STATUS', updateDiscountDto);

    discount.isActive = updateDiscountDto.isActive;
    await this.discountRepository.update(id, updateDiscountDto);

    return this.discountRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    const discount = await this.discountRepository.findOneBy({ id });

    if (!discount) {
      throw new NotFoundException(`تخفیف با شناسه ${id} پیدا نشد.`);
    }

    await this.imageRepository.delete({ discount });

    await this.discountRepository.remove(discount);
  }
}
