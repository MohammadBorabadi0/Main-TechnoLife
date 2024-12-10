// users.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ProtectGuard } from 'src/common/guards/protect.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.usersService.findAll(+page, +limit, search);
  }

  @Get('profile')
  @UseGuards(ProtectGuard)
  async getUserprofile(@Req() req: Request) {
    const user = req.user;
    return { success: true, data: user };
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('profile')
  @UseGuards(ProtectGuard)
  async updateUserProfile(
    @Req() req: Request,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const userId = req.user.id;
    await this.usersService.updateUserProfile(userId, updateUserProfileDto);
    const user = await this.usersService.findById(userId);
    return { success: true, data: user };
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(id, updateUserDto);
    await this.usersService.updateUser(id, updateUserDto);
    const user = await this.usersService.findById(id);
    return { success: true, data: user };
  }
}
