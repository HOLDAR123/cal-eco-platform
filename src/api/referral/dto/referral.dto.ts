import { ResponseType } from '../../auth/dto/auth.dto';

export interface ReferralUserDto {
  referral_user: number;
  address: string;
  datetime: Date;
  token: number;
}

export interface ReferralEarningsDto {
  total_earnings?: number;
  referral_count?: number;
}

export type ReferralListResponse = ResponseType<ReferralUserDto[]>;
export type ReferralEarningsResponse = ResponseType<ReferralEarningsDto>;
