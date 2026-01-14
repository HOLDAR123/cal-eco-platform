import { ResponseType } from '../../auth/dto/auth.dto';

export interface WalletDto {
  id: number;
  user_id: number;
  address: string;
  chain: string;
  is_primary: number;
  created_at: Date;
}

export interface CreateWalletDto {
  address: string;
  chain?: string;
  is_primary?: boolean;
}

export type WalletListResponse = ResponseType<WalletDto[]>;
export type WalletResponse = ResponseType<WalletDto>;
