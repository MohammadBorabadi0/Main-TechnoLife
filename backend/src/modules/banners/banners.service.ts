import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  // Check Exists Name
  async checkExistsName(
    name: string,
    id?: string,
  ): Promise<{ exists: boolean }> {
    const existingBanner = await this.bannerRepository.findOne({
      where: { name },
    });

    if (existingBanner && existingBanner.id !== id) {
      return { exists: true };
    }

    return { exists: false };
  }

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    // Check if a banner with the same name already exists
    const { exists } = await this.checkExistsName(createBannerDto.name);

    if (exists) {
      throw new BadRequestException(
        `Banner with name "${createBannerDto.name}" already exists.`,
      );
    }

    // Create and save the new banner
    const banner = this.bannerRepository.create(createBannerDto);
    return this.bannerRepository.save(banner);
  }

  async findAllBanners(
    page: number,
    limit: number,
    search: string,
  ): Promise<{
    banners: Banner[];
    totalPages: number;
    totalBanners: number;
  }> {
    // Ensure limit doesn't exceed a maximum value
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    // Build the search query
    const searchQuery = search ? { name: Like(`%${search.trim()}%`) } : {};

    // Fetch banners with pagination and search
    const [banners, totalBanners] = await this.bannerRepository.findAndCount({
      where: searchQuery,
      skip,
      take: limit,
    });

    // Calculate total pages based on total banners and limit
    const totalPages = Math.ceil(totalBanners / limit);

    return {
      banners,
      totalPages,
      totalBanners,
    };
  }

  async findOne(id: string): Promise<Banner> {
    const banner = await this.bannerRepository.findOneBy({ id });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner> {
    const banner = await this.findOne(id);

    const { exists } = await this.checkExistsName(
      updateBannerDto.name,
      banner.id,
    );

    if (exists) {
      throw new BadRequestException(
        `Banner with name "${updateBannerDto.name}" already exists.`,
      );
    }

    Object.assign(banner, updateBannerDto);
    return this.bannerRepository.save(banner);
  }

  async updateStatus(
    id: string,
    updateBannerDto: UpdateBannerDto,
  ): Promise<Banner> {
    const banner = await this.findOne(id);

    if (!banner) {
      throw new NotFoundException(`بنر با شناسه ${id} پیدا نشد.`);
    }

    banner.isActive = updateBannerDto.isActive;
    await this.bannerRepository.update(id, updateBannerDto);

    return this.bannerRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const result = await this.bannerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
  }
}
