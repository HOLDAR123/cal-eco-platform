import mockData from '../../../libs/data/mockData';
import { UserData, DatabaseResult, PlanDetailItem, RewardClaimCheckResult, StakingQuantityResult, TotalBalanceData, ReferralUserData, TotalInvestedData, StakingData, TransactionData, WithdrawRequestData, StakingWithReward } from '../../../libs/types';

class UserModel {
  async getUsersDetailsAddress(data: { address: string }): Promise<import('../../../libs/data/mockData').User[]> {
    return mockData.getUserByAddress(data.address);
  }

  async getUserDetailsByAddress(referralCode: string): Promise<import('../../../libs/data/mockData').User[]> {
    return mockData.getUserByReferralCode(referralCode);
  }

  async getUsersAddress(data: { address: string }): Promise<import('../../../libs/data/mockData').User[]> {
    return mockData.getUserByAddress(data.address);
  }

  async checkBalanceFromStaking(data: { user_id: number }): Promise<import('../../../libs/data/mockData').User[]> {
    return mockData.getUserById(data.user_id);
  }

  async saveUserAddressDetails(data: UserData): Promise<DatabaseResult> {
    return mockData.createUser(data);
  }

  async saveReferralTransaction(data: { address: string; amount: number }, addressTo: string): Promise<DatabaseResult> {
    const refBalance = ((data.amount || 0) * 5) / 100;
    return mockData.createReferralTransaction({
      address: data.address || '',
      to_address: addressTo,
      amount: data.amount || 0,
      ref_balance: parseFloat(refBalance.toFixed(2)),
      percentage: 5,
    });
  }

  async getPlanDetails(): Promise<PlanDetailItem[]> {
    return mockData.getStakingPlans();
  }

  async checkHash(data: { hash: string }): Promise<{ id: number }[]> {
    const transactions = mockData.getTransactionByHash(data.hash);
    return transactions.map(t => ({ id: t.id }));
  }

  async saveDepositBUSDDetails(data: TransactionData): Promise<DatabaseResult> {
    return mockData.createTransaction({
      user_id: data.user_id,
      address: data.address,
      from_address: data.from_address || '',
      to_address: data.to_address || '',
      hash: data.hash || null,
      busd_amount: data.busd_amount,
      token: typeof data.token === 'number' ? data.token : parseFloat(data.token),
      transaction_type_id: data.transaction_type_id,
      status: data.status,
    });
  }

  async checkPeriodId(data: { staking_period_id: number }): Promise<PlanDetailItem[]> {
    const plan = mockData.getStakingPlanById(data.staking_period_id);
    if (plan) {
      return [plan];
    }
    return [];
  }

  async stakingQuantity(data: { staking_id: number; staking_period_id: number; user_id: number }): Promise<StakingQuantityResult[]> {
    const stakings = mockData.getStakingById(data.staking_id, data.staking_period_id, data.user_id);
    if (stakings.length > 0) {
      const staking = stakings[0];
      return [{
        id: staking.id,
        reward_token: staking.reward_token,
        remaining_quantity: staking.remaining_quantity,
      }];
    }
    return [];
  }

  async addStaking(data: StakingData & { address?: string; from_address?: string; to_address?: string }): Promise<DatabaseResult> {
    const result = mockData.createStaking({
      user_id: data.user_id,
      token_amount: data.token_amount,
      busd_amount: data.busd_amount,
      staking_period_id: data.staking_period_id,
      staking_duration: data.staking_duration,
      staking_percentage: data.staking_percentage,
      reward_token: data.reward_token,
      hash: data.hash || '',
      quantity: data.quantity,
      remaining_quantity: data.remaining_quantity,
    });

    mockData.createTransaction({
      user_id: data.user_id,
      address: data.address || '',
      staking_id: result.insertId,
      from_address: data.from_address || '',
      to_address: data.to_address || '',
      hash: data.hash || '',
      busd_amount: data.busd_amount,
      token: data.token_amount,
      transaction_type_id: 9,
      status: 1,
    });

    const mbusdBalance = parseFloat((data.token_amount * data.quantity).toString());
    mockData.updateUserBalance(data.user_id, 'MBUSD_balance', -mbusdBalance);

    return result;
  }

  async saveReferralIncome(data: TransactionData & { address?: string }): Promise<DatabaseResult> {
    const tokenValue = typeof data.token === 'number' ? data.token : parseFloat(data.token);
    const newToken = parseFloat((tokenValue * 5 / 100).toFixed(2));
    return mockData.createTransaction({
      user_id: data.user_id,
      address: data.address || '',
      referred_by: data.referred_by || null,
      busd_amount: data.busd_amount,
      token: newToken,
      referral_level: 1,
      referral_trx_id: data.referred_by || null,
      referral_percent: 5,
      transaction_type_id: 4,
      status: 1,
    });
  }

  async getReferralUser(data: number): Promise<import('../../../libs/data/mockData').User[]> {
    return mockData.getUserById(data);
  }

  async getTransactionHistory(data: { user_id: number }): Promise<TransactionData[]> {
    const transactions = mockData.getTransactionsByUserId(data.user_id, 1);
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

  async getWithdrawHistory(data: { user_id: number }): Promise<WithdrawRequestData[]> {
    const requests = mockData.getWithdrawRequestsByUserId(data.user_id);
    return requests.map(wr => ({
      id: wr.id,
      user_id: wr.user_id,
      withdrawal_address: wr.withdrawal_address,
      token: wr.token,
      busd_amount: wr.busd_amount,
      fee: wr.fee,
      hash: wr.hash,
      status: wr.status,
      created_at: wr.created_at,
    }));
  }

  async getStakingHistory(data: { user_id: number }): Promise<StakingWithReward[]> {
    return mockData.getStakingByUserId(data.user_id);
  }

  async usersStakingIncome(): Promise<DatabaseResult> {
    const allStaking = mockData.getAllStaking();
    for (const staking of allStaking) {
      if (staking.status === 1 && staking.is_claim === 1) {
        mockData.createStakingEarning({
          staking_id: staking.id,
          user_id: staking.user_id,
          staking_period_id: staking.staking_period_id,
          reward_token: staking.reward_token * staking.remaining_quantity,
          is_claim: 1,
          status: 1,
        });
      }
    }
    return { affectedRows: allStaking.length };
  }

  async rewardClaimCheck(data: { staking_id: number; staking_period_id: number; user_id: number }): Promise<RewardClaimCheckResult[]> {
    const staking = mockData.getStakingById(data.staking_id, data.staking_period_id, data.user_id);
    if (staking.length > 0) {
      const s = staking[0];
      const earnings = mockData.getStakingEarningsByStakingId(data.staking_id);
      const lastEarning = earnings.length > 0 ? earnings[earnings.length - 1] : null;
      const lastDate = lastEarning ? new Date(lastEarning.datetime) : new Date(s.created_date);
      const hoursSinceLastClaim = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60);
      return [{
        datetime: lastEarning ? lastEarning.datetime : null,
        created_date: s.created_date,
        isClaimAvailable: hoursSinceLastClaim >= 24 ? 1 : 0,
      }];
    }
    return [];
  }

  async singalRewardClaim(data: { staking_id: number; user_id: number; staking_period_id: number; token: number }): Promise<DatabaseResult> {
    mockData.createStakingEarning({
      staking_id: data.staking_id,
      user_id: data.user_id,
      staking_period_id: data.staking_period_id,
      reward_token: data.token,
      is_claim: 1,
      status: 1,
    });

    mockData.updateUserBalance(data.user_id, 'token_balance', parseFloat(data.token.toString()));

    return { success: true };
  }

  async addBalance(data: { user_id: number; token: number }): Promise<DatabaseResult> {
    return mockData.updateUserBalance(data.user_id, 'MBUSD_balance', data.token);
  }

  async checkSellPlan(data: { staking_id: number; staking_period_id: number; user_id: number }): Promise<StakingQuantityResult[]> {
    const stakings = mockData.getStakingById(data.staking_id, data.staking_period_id, data.user_id);
    if (stakings.length > 0) {
      const staking = stakings[0];
      const createdDate = new Date(staking.created_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      createdDate.setHours(0, 0, 0, 0);

      if (staking.status === 1 && createdDate < today) {
        return [{
          id: staking.id,
          reward_token: staking.reward_token,
          remaining_quantity: staking.remaining_quantity,
        }];
      }
    }
    return [];
  }

  async sellPlan(data: { staking_id: number; user_id: number; reward_token: number }): Promise<DatabaseResult> {
    const newToken = data.reward_token * 14;
    mockData.updateStakingStatus(data.staking_id, data.user_id, {
      is_claim: 0,
      status: 0,
      plan_sell_date: new Date(),
    });

    mockData.updateUserBalance(data.user_id, 'token_balance', parseFloat(newToken.toString()));

    return { success: true };
  }

  async getTotalBalance(data: { user_id: number }): Promise<TotalBalanceData[]> {
    return mockData.getTotalBalance(data.user_id);
  }

  async insertWithdrawRequest(data: WithdrawRequestData): Promise<DatabaseResult> {
    return mockData.createWithdrawRequest({
      user_id: data.user_id,
      withdrawal_address: data.withdrawal_address,
      token: data.token,
      busd_amount: data.busd_amount,
      status: 0,
    });
  }

  async withdrawCrypto(data: WithdrawRequestData): Promise<DatabaseResult> {
    return mockData.createWithdrawRequest({
      user_id: data.user_id,
      withdrawal_address: data.withdrawal_address,
      token: data.token,
      busd_amount: data.busd_amount,
      fee: data.fee || 0,
      hash: data.hash || null,
      status: data.status,
    });
  }

  async balanceUpdate(data: { id: number; user_id: number; busd_amount: number; token: number }): Promise<DatabaseResult> {
    mockData.updateTransaction(data.id, {
      busd_amount: data.busd_amount,
      token: data.token,
      isblockchainConfirm: 1,
    });

    mockData.updateUserBalance(data.user_id, 'MBUSD_balance', data.token);

    return { success: true };
  }

  async getReferralUsersList(data: { user_id: number }): Promise<ReferralUserData[]> {
    return mockData.getReferralUsers(data.user_id);
  }

  async getTotalInvested(): Promise<TotalInvestedData[]> {
    return mockData.getTotalInvested();
  }

  async userBalanceUpdate(data: { id: number; user_id: number; busd_amount: number; token: number }): Promise<DatabaseResult> {
    return this.balanceUpdate(data);
  }

  async userBalanceReject(data: { id: number }): Promise<DatabaseResult> {
    mockData.updateTransaction(data.id, { isblockchainConfirm: 2 });
    return { affectedRows: 1 };
  }

  async userBUSDDepositCheck(): Promise<TransactionData[]> {
    const transactions = mockData.getPendingDeposits();
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

export default new UserModel();
