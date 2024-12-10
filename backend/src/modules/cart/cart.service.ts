import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = new Cart();
    cart.user = { id: createCartDto.userId } as any;
    cart.items = await Promise.all(
      createCartDto.items.map(async (item) => {
        const cartItem = new CartItem();
        cartItem.product = { id: item.productId } as any;
        cartItem.quantity = item.quantity;
        cartItem.price = 100; // Example price, replace with product's price
        return cartItem;
      }),
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    return this.cartRepository.save(cart);
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    if (updateCartDto.items) {
      cart.items = await Promise.all(
        updateCartDto.items.map(async (item) => {
          const cartItem = new CartItem();
          cartItem.product = { id: item.productId } as any;
          cartItem.quantity = item.quantity;
          cartItem.price = 100; // Example price, replace with product's price
          return cartItem;
        }),
      );
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
    }
    return this.cartRepository.save(cart);
  }

  async delete(id: number): Promise<void> {
    await this.cartRepository.delete(id);
  }
}
