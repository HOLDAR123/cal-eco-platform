import { ResponseType } from '../../auth/dto/auth.dto';

export interface WithdrawalDto {
  id: number;
  user_id: number;
  withdrawal_address: string;
  token: number;
  busd_amount: number;
  fee: number;
  hash?: string | null;
  status: number;
  created_at?: Date;
}

export interface CreateWithdrawalDto {
  address: string;
  token: number;
}

export type WithdrawalListResponse = ResponseType<WithdrawalDto[]>;
export type WithdrawalResponse = ResponseType<WithdrawalDto>;
