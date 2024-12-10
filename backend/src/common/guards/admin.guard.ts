import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('User is not logged in');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'jwt_secret',
      });

      const user = await this.usersService.findById(decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user && !user.isAdmin) {
        throw new ForbiddenException('Access denied: Admins only');
      }

      request.user = user;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
