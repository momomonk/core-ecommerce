import { Controller, Get, Post, Patch, Put, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginUseCase } from '../../../application/use-cases/login.use-case';
import { ValidateTokenUseCase } from '../../../application/use-cases/validate-token.use-case';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }
  
  @Post('validate-token')
  async validateToken(@Body() body: ValidateTokenDto) {
    return this.validateTokenUseCase.execute(body);
  }
}