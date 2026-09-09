import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { LoginDto } from '../../infrastructure/transport/http/dto/login.dto';
import { ErrorMessages } from '../../common/constants/error-messages';
import { BcryptService } from '../../infrastructure/persistence/services/bycrypt-password-hasher.services';
import { JwtTokenService } from '../../infrastructure/persistence/services/jwt.services';
import { RolesApiClient } from '../../infrastructure/clients/roles-api.client'; // 👈 1. Importar el cliente

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository') private readonly repo: UserRepository,
    private readonly bcryptService: BcryptService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly rolesApiClient: RolesApiClient, // 👈 2. Inyectarlo aquí
  ) {}

  async execute(dto: LoginDto) {
    const userAvailable = await this.repo.findByEmail(dto.email);
    if (!userAvailable) throw new BadRequestException(ErrorMessages.EMAIL_NOT_FOUND);

    const isMatch = await this.bcryptService.comparePassword(
      dto.password,
      userAvailable.password!,
    );
    if (!isMatch) throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);

    // 🚀 3. Consultar los permisos a la API independiente de roles
    const permissions = await this.rolesApiClient.getUserPermissions(userAvailable.id);

    // 4. Enriquecer el payload con los permisos obtenidos
    const payload = { 
      sub: userAvailable.id, 
      email: userAvailable.email,
      permissions: permissions, // 👈 Se inyectan en el JWT
    };
    
    const accessToken = await this.jwtTokenService.generateToken(payload);

    return {
      accessToken,
    };
  }
}