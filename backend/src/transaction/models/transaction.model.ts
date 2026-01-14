import mockData from '../../../libs/data/mockData';
import { TransactionData } from '../../../libs/types';

class TransactionModel {
  async listByUser(data: { user_id: number }): Promise<TransactionData[]> {
    const transactions = mockData.getTransactionsByUserId(data.user_id);
    return transactions.map(t => ({
      id: t.id,
      user_id: t.user_id,
      address: t.address,
      staking_id: t.staking_id,
      from_address: t.from_address,
      to_address: t.to_address,
      hash: t.hash,
      busd_amount: t.busd_amount,
      token: t.token,
      transaction_type_id: t.transaction_type_id,
      status: t.status,
      isblockchainConfirm: t.isblockchainConfirm,
      referred_by: t.referred_by,
      referral_level: t.referral_level,
      referral_trx_id: t.referral_trx_id,
      referral_percent: t.referral_percent,
      created_at: t.created_at,
    }));
  }
}

export default new TransactionModel();
