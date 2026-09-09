import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthApiService {
  private readonly authServiceUrl = 'http://auth-service:3011/auth/validate-token'; 

  async validateTokenWithAuthService(token: string): Promise<any> {
    try {
      const response = await axios.post(this.authServiceUrl, { token });
      if (!response.data.success) {
        throw new UnauthorizedException('Token inválido o expirado');
      }

      return response.data.payload; // Retorna el payload del token (userId, email, etc.)
    } catch (error) {
      throw new UnauthorizedException('No se pudo validar el token con el servicio de autenticación');
    }
  }
}