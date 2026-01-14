import { ResponseType } from '../../auth/dto/auth.dto';

export interface TransactionDto {
  id: number;
  user_id: number;
  address: string;
  staking_id?: number | null;
  from_address?: string | null;
  to_address?: string | null;
  hash?: string | null;
  busd_amount: number;
  token: number | string;
  transaction_type_id: number;
  status: number;
  isblockchainConfirm?: number;
  referred_by?: number | null;
  referral_level?: number | null;
  referral_trx_id?: number | null;
  referral_percent?: number | null;
  created_at?: Date;
}

export interface CreateDepositDto {
  busd_amount: number;
  hash: string;
}

export type TransactionListResponse = ResponseType<TransactionDto[]>;
export type TransactionResponse = ResponseType<TransactionDto>;
