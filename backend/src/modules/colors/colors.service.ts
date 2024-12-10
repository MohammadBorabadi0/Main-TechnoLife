import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}

  // Check Exists Name
  async checkExistsName(
    name: string,
    id?: string,
  ): Promise<{ exists: boolean }> {
    const existingColor = await this.colorRepository.findOne({
      where: { name },
    });

    if (existingColor && existingColor.id !== id) {
      return { exists: true };
    }

    return { exists: false };
  }

  // Check Exists Name
  async checkExistsCode(
    code: string,
    id?: string,
  ): Promise<{ exists: boolean }> {
    const existingColor = await this.colorRepository.findOne({
      where: { code },
    });

    if (existingColor && existingColor.id !== id) {
      return { exists: true };
    }

    return { exists: false };
  }

  async create(createColorDto: CreateColorDto): Promise<Color> {
    // Check if a color with the same name already exists
    const { exists: existsName } = await this.checkExistsName(
      createColorDto.name,
    );

    if (existsName) {
      throw new BadRequestException('رنگ با این نام از قبل وجود دارد.');
    }

    // Check if a color with the same code already exists
    const { exists: existsCode } = await this.checkExistsCode(
      createColorDto.code,
    );

    if (existsCode) {
      throw new BadRequestException('رنگ با این کد از قبل وجود دارد');
    }

    const category = this.colorRepository.create(createColorDto);
    return this.colorRepository.save(category);
  }

  async findAllColors(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<{ colors: Color[]; totalPages: number; totalColors: number }> {
    limit = Math.min(limit, 100);
    const skip = (page - 1) * limit;

    // Build the search query for color name
    const searchQuery = search
      ? [
          { name: Like(`%${search.trim()}%`) },
          { code: Like(`%${search.trim()}%`) },
        ]
      : [];

    // Fetch colors with pagination and search
    const [colors, totalColors] = await this.colorRepository.findAndCount({
      where: searchQuery,
      skip,
      take: limit,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalColors / limit);

    return {
      colors,
      totalPages,
      totalColors,
    };
  }

  async findOne(id: string): Promise<Color> {
    const color = await this.colorRepository.findOneBy({ id });

    if (!color) {
      throw new NotFoundException('رنگ با این مشخصات پیدا نشد.');
    }

    return this.colorRepository.findOneBy({ id });
  }

  async update(id: string, updateColorDto: UpdateColorDto): Promise<Color> {
    // Check if the color exists
    const color = await this.colorRepository.findOneBy({ id });
    if (!color) {
      throw new Error(`رنگ با شناسه ${id} پیدا نشد.`);
    }

    const { exists: existsName } = await this.checkExistsName(
      updateColorDto.name,
      id,
    );

    if (existsName) {
      throw new BadRequestException('رنگ با این نام از قبل وجود دارد.');
    }

    const { exists: existsCode } = await this.checkExistsCode(
      updateColorDto.code,
      id,
    );

    if (existsCode) {
      throw new BadRequestException('رنگ با این کد از قبل وجود دارد.');
    }

    // Proceed with updating the color
    await this.colorRepository.update(id, updateColorDto);
    return this.colorRepository.findOneBy({ id });
  }

  async updateStatus(
    id: string,
    updateColorDto: UpdateColorDto,
  ): Promise<Color> {
    // Check if the color exists
    const color = await this.colorRepository.findOneBy({ id });
    if (!color) {
      throw new Error(`رنگ با شناسه ${id} پیدا نشد.`);
    }

    color.isActive = updateColorDto.isActive;
    await this.colorRepository.update(id, updateColorDto);

    return this.colorRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const color = await this.colorRepository.findOneBy({ id });

    if (!color) {
      throw new NotFoundException(`رنگ با شناسه ${id} پیدا نشد.`);
    }

    await this.colorRepository.delete(id);
  }
}
