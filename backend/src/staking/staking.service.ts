import UserModel from '../user/models/user.model';

export class StakingService {
  async createStaking(userId: number, address: string, body: {
    staking_period_id: number;
    quantity: number;
    busd_amount: number;
    hash?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    id?: number;
  }> {
    try {
      const check = await UserModel.checkPeriodId({ staking_period_id: body.staking_period_id });
      if (check.length === 0) {
        return { success: false, message: 'Invalid plan' };
      }

      const stakingData = {
        user_id: userId,
        address: address,
        staking_period_id: body.staking_period_id,
        quantity: body.quantity,
        remaining_quantity: body.quantity,
        token_amount: check[0].price,
        reward_token: parseFloat(check[0].token),
        busd_amount: body.busd_amount,
        staking_duration: check[0].duration,
        staking_percentage: check[0].staking_percentage,
        hash: body.hash || '',
      };

      const result = await UserModel.addStaking(stakingData);
      return { success: true, id: result.insertId };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async getStakingHistory(userId: number): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const data = await UserModel.getStakingHistory({ user_id: userId });
      return { success: true, data };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async claimReward(userId: number, stakingId: number, stakingPeriodId: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const body = { user_id: userId, staking_id: stakingId, staking_period_id: stakingPeriodId };
      const rewardCheck = await UserModel.rewardClaimCheck(body);
      if (rewardCheck.length === 0 || rewardCheck[0].isClaimAvailable === 0) {
        return { success: false, message: 'Claim not available yet' };
      }

      const qty = await UserModel.stakingQuantity(body);
      if (qty.length === 0) {
        return { success: false, message: 'Invalid staking' };
      }

      const token = parseFloat(qty[0].reward_token.toString()) * parseFloat(qty[0].remaining_quantity.toString());
      if (token <= 0) {
        return { success: false, message: 'No reward' };
      }

      await UserModel.singalRewardClaim({ ...body, token });
      return { success: true };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async sellPlan(userId: number, stakingId: number, stakingPeriodId: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const body = { user_id: userId, staking_id: stakingId, staking_period_id: stakingPeriodId };
      const check = await UserModel.checkSellPlan(body);
      if (check.length === 0) {
        return { success: false, message: 'Invalid staking details' };
      }

      const rewardToken = parseFloat(check[0].reward_token.toString()) * parseFloat(check[0].remaining_quantity.toString());
      await UserModel.sellPlan({ ...body, reward_token: rewardToken });
      return { success: true };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
