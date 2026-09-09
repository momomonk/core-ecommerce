import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RolesApiClient {
  // Usamos el nombre del servicio Docker de tu API de roles (cámbialo si tu otro servicio tiene otro nombre)
  private readonly rolesServiceUrl = process.env.ROLES_SERVICE_URL || 'http://roles-service:3020';

  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      const response = await axios.get(`${this.rolesServiceUrl}/users/${userId}/permissions`);
      return response.data.permissions || [];
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los permisos del usuario desde el servicio de roles');
    }
  }
}