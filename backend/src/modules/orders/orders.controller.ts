import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { AdminGuard } from '@common/guards/admin.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Get All Orders
  @Get()
  @UseGuards(AdminGuard)
  async getAllOrders(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.orderService.getAllOrders(+page, +limit, search);
  }

  //   Get My Orders
  @Get('my')
  @UseGuards(AdminGuard)
  async getUserOrders(@Request() req): Promise<Order[]> {
    const userId = req.user.id;
    return this.orderService.getMyOrders(userId);
  }

  // Create Order
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  // Update Order
  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  // Get Order by ID
  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }
}
