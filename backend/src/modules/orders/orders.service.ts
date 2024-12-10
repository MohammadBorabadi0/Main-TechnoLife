import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  // Create Order
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    const savedOrder = await this.orderRepository.save(order);

    // Handle order items
    const orderItems = createOrderDto.orderItems.map((item) => {
      const orderItem = this.orderItemRepository.create({
        ...item,
        order: savedOrder,
      });
      return this.orderItemRepository.save(orderItem);
    });

    // Save order items to database
    await Promise.all(orderItems);

    return savedOrder;
  }

  // Update Order
  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new Error('Order not found');
    }

    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  // Get Order by ID
  async getOrderById(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems', 'user'],
    });
  }

  // Get All Orders
  async getAllOrders(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<{ orders: Order[]; totalPages: number; totalOrders: number }> {
    try {
      limit = Math.min(limit, 100);
      const skip = (page - 1) * limit;

      const queryBuilder = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.orderItems', 'orderItem')
        .leftJoinAndSelect('order.user', 'user')
        .skip(skip)
        .take(limit);

      if (search) {
        queryBuilder
          .where('order.orderNumber LIKE :search', {
            search: `%${search.trim()}%`,
          })
          .orWhere('user.username LIKE :search', {
            search: `%${search.trim()}%`,
          });
      }

      // Execute query to get orders with pagination and filtering
      const [orders, totalOrders] = await queryBuilder.getManyAndCount();

      // Calculate total pages
      const totalPages = Math.ceil(totalOrders / limit);

      return {
        orders,
        totalPages,
        totalOrders,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Server error occurred while fetching orders');
    }
  }

  // Get My Orders
  async getMyOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems'],
    });
  }
}
