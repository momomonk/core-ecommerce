import { Injectable, Inject } from '@nestjs/common';
import { BusinessRepository } from '../../domain/repositories/business.repository';

@Injectable()
export class ListBusinessesUseCase {
  constructor(@Inject('BusinessRepository') private readonly repo: BusinessRepository) {}

  async execute(page: number, limit: number) {
    return await this.repo.findAll(page, limit);
  }
}