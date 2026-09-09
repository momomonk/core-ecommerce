import { Exclude } from 'class-transformer';

export class User {
  public readonly id: string;
  public readonly first_name: string;
  public readonly last_name: string;
  public readonly email: string;
  public readonly password?: string;
  public readonly cellphone: string;
  public active: boolean; 

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  get isActive(): boolean {
    return this.active;
  }

  changeStatus(status: boolean): void {
    if (this.active === status) {
      throw new Error(`User is already ${status ? 'active' : 'inactive'}`);
    }
    this.active = status;
  }
}