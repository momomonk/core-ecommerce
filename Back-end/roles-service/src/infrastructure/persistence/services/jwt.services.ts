import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: NestJwtService) {}

  async generateToken(payload: object): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: 'TU_CLAVE_SECRETA_SUPER_SEGURA', 
      expiresIn: '1h',
    });
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: 'TU_CLAVE_SECRETA_SUPER_SEGURA',
      });
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}