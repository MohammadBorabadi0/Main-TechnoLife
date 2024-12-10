import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException(
        'ایمیل از قبل وجود دارد. لطفا وارد سایت شوید',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('ایمیل یا رمز عبور شما اشباه است');
    }

    const payload = { sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: 'jwt_secret',
        expiresIn: '1d',
      }),
      user,
    };
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
