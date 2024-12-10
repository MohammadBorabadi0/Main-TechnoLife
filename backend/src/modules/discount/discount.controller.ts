import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ApplyDiscountDto } from './dto/apply-discount.dto';

@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  // Check Exists Name
  @Post('exists')
  async checkExistsName(@Body() body: { name: string; id?: string }) {
    const { name, id } = body;
    const result = await this.discountService.checkExistsName(name, id);
    return result;
  }

  @Post('apply')
  async applyDiscount(@Body() applyDiscountDto: ApplyDiscountDto) {
    return this.discountService.applyDiscount(applyDiscountDto);
  }

  @Post()
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return await this.discountService.create(createDiscountDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.discountService.findAll(+page, +limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.discountService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
    return await this.discountService.update(id, dto);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.updateStatus(id, updateDiscountDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.discountService.delete(id);
  }
}
