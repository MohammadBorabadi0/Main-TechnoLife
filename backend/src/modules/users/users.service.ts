// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    return this.userRepository.save(data);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email } as any,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<{ users: User[]; totalPages: number; totalUsers: number }> {
    try {
      limit = Math.min(limit, 100);
      const skip = (page - 1) * limit;

      const searchQuery = search
        ? {
            where: [
              { firstName: Like(`%${search.trim()}%`) },
              { lastName: Like(`%${search.trim()}%`) },
              { email: Like(`%${search.trim()}%`) },
            ],
          }
        : {};

      // Fetch users with pagination and search functionality
      const [users, totalUsers] = await this.userRepository.findAndCount({
        ...searchQuery,
        skip,
        take: limit,
      });

      // Calculate total pages
      const totalPages = Math.ceil(totalUsers / limit);

      return {
        users,
        totalPages,
        totalUsers,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Server error occurred while fetching users');
    }
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async updateUserProfile(
    id: string,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<User> {
    await this.userRepository.update(id, updateUserProfileDto);
    return this.userRepository.findOneBy({ id });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOneBy({ id });
  }
}
