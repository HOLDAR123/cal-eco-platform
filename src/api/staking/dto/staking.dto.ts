import { ResponseType } from '../../auth/dto/auth.dto';

export interface StakingDto {
  id: number;
  user_id: number;
  token_amount: number;
  busd_amount: number;
  staking_period_id: number;
  staking_duration: number;
  staking_percentage: number;
  reward_token: number;
  hash?: string;
  quantity: number;
  remaining_quantity: number;
  is_claim?: number;
  status?: number;
  created_date?: Date;
}

export interface CreateStakingDto {
  staking_period_id: number;
  quantity: number;
  busd_amount: number;
  hash?: string;
}

export interface ClaimStakingDto {
  staking_id: number;
  staking_period_id: number;
}

export interface SellStakingDto {
  staking_id: number;
  staking_period_id: number;
}

export type StakingListResponse = ResponseType<StakingDto[]>;
export type StakingResponse = ResponseType<StakingDto>;
