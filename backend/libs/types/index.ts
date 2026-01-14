import { Request } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

export interface UserData {
  id?: number;
  address: string;
  referral_code?: string;
  referral_id?: number | null;
  token_balance?: number;
  MBUSD_balance?: number;
  is_admin?: number;
  datetime?: Date;
}

export interface WalletData {
  id?: number;
  user_id: number;
  address: string;
  chain?: string;
  is_primary?: boolean | number;
  created_at?: Date;
}

export interface StakingData {
  id?: number;
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

export interface TransactionData {
  id?: number;
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

export interface WithdrawRequestData {
  id?: number;
  user_id: number;
  withdrawal_address: string;
  token: number;
  busd_amount: number;
  fee?: number;
  hash?: string | null;
  status: number;
  created_at?: Date;
}

export interface StakingEarningData {
  id?: number;
  staking_id: number;
  user_id: number;
  staking_period_id: number;
  reward_token: number;
  is_claim?: number;
  status?: number;
  datetime?: Date;
}

export interface NotificationData {
  id?: number;
  user_id: number;
  title: string;
  message: string;
  type?: string;
  is_read?: number;
  created_at?: Date;
}

export interface TicketData {
  id?: number;
  user_id: number;
  subject: string;
  status?: string;
  created_at?: Date;
}

export interface TicketMessageData {
  id?: number;
  ticket_id: number;
  user_id: number;
  message: string;
  is_admin?: number;
  created_at?: Date;
}

export interface ReferralTransactionData {
  id?: number;
  address: string;
  to_address: string;
  amount: number;
  ref_balance: number;
  percentage: number;
  datetime?: Date;
}

export interface SessionData {
  user_id: number;
  refresh_token: string;
  expires_at: Date;
}

export interface DatabaseResult {
  insertId?: number;
  affectedRows?: number;
  [key: string]: unknown;
}

export interface StakingWithReward extends StakingData {
  totalreward?: number;
  unstakeDate?: Date;
  remaining_second?: number;
}

export interface WithdrawRequestWithAddress extends WithdrawRequestData {
  address?: string | null;
}

export interface ReferralUserData {
  referral_user: number;
  address: string;
  datetime: Date;
  token: number;
}

export interface TotalInvestedData {
  invested: number;
  investors: number;
  reward: number;
}

export interface TotalBalanceData {
  total_balance: number;
  MBUSD_total_balance: number;
}

export interface SocketJoinData {
  room: string | number;
  username: string;
}

export interface SocketChatData {
  ticket_id: string | number;
  sender: number;
  receiver?: number;
  message: string;
}

export interface Web3Provider {
  eth: {
    getTransactionReceipt: (hash: string) => Promise<{
      from: string;
      to: string;
      logs: Array<{
        topics: string[];
        data: string;
      }>;
    }>;
    abi: {
      decodeParameter: (type: string, data: string) => Promise<string>;
    };
  };
  providers: {
    HttpProvider: new (url: string) => unknown;
  };
}

export interface TransferData {
  from_address: string;
  from_private_key: string;
  amount: number;
  contract_address: string;
  to_address: string;
}

export interface ErrorWithCode extends Error {
  code?: string;
}

export type AdminRequest = Request;
export type EmptyRequest = Request;
export type UpdateMeRequest = Request;

export interface UserListItem {
  id: number;
  address: string;
  referral_code: string;
  token_balance: number;
  MBUSD_balance: number;
  datetime: Date;
}

export interface StakingDetailItem {
  token_amount: number;
  staking_period_id: number;
  staking_percentage: number;
  staking_duration: number;
  reward_token: number;
  remaining_quantity: number;
  is_claim: number;
  status: number;
  address: string | null;
  created_date: Date;
  plan_name: string | null;
}

export interface StakingEarningDetailItem {
  reward_token: number;
  is_claim: number;
  status: number;
  datetime: Date;
  staking_period_id: number;
  address: string | null;
  staking_duration: number | null;
  token_amount: number | null;
  remaining_quantity: number | null;
  perreward: number | null;
  plan_name: string | null;
}

export interface DepositBUSDDetailItem {
  address: string;
  from_address: string | null;
  to_address: string | null;
  hash: string | null;
  busd_amount: number;
  token: number;
  status: number;
  datetime: Date;
}

export interface PlanDetailItem {
  id: number;
  price: number;
  duration: number;
  token: string;
  staking_percentage: number;
  created_at: Date;
}

export interface RewardClaimCheckResult {
  datetime: Date | null;
  created_date: Date;
  isClaimAvailable: number;
}

export interface StakingQuantityResult {
  id: number;
  reward_token: number;
  remaining_quantity: number;
}
