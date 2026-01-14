import { ResponseType } from '../../auth/dto/auth.dto';

export interface UserDto {
  id: number;
  address: string;
  referral_code?: string;
  token_balance?: number;
  MBUSD_balance?: number;
  is_admin?: number;
  datetime?: Date;
}

export interface UpdateUserDto {
  address?: string;
}

export type UserResponse = ResponseType<UserDto>;
