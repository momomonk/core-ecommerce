import { Injectable} from '@nestjs/common';
import { ValidateTokenDto } from '../../infrastructure/transport/http/dto/validate-token.dto';
import { JwtTokenService } from '../../infrastructure/persistence/services/jwt.services'; // Tu servicio propio

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(dto: ValidateTokenDto) {
    const isValid = await this.jwtTokenService.verifyToken(dto.token);

    return {
      isValid,
    };
  }
}