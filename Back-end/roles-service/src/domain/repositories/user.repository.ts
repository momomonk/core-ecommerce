import { User } from '../entities/user.entity';
import { PaginatedResult } from '../../common/pagination';

export interface UserRepository {
  findAll(page: number, limit: number): Promise<PaginatedResult<User>>;
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  updateStatus(id: string, status: boolean): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: User): Promise<void>;
}