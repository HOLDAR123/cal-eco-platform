import UserModel from '../user/models/user.model';

export class WithdrawalService {
  async createWithdrawRequest(userId: number, address: string, token: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const total = await UserModel.getTotalBalance({ user_id: userId });
      if (total.length === 0) {
        return { success: false, message: 'Balance unavailable' };
      }

      if (parseFloat(token.toString()) <= 0) {
        return { success: false, message: 'Invalid amount' };
      }

      if (parseFloat(token.toString()) > parseFloat(total[0].total_balance.toString())) {
        return { success: false, message: 'Insufficient balance' };
      }

      const busd_amount = (parseFloat(token.toString()) * 0.000166) - 0.3;
      if (busd_amount < 1) {
        return { success: false, message: 'Minimum withdraw 10,000 Token (1 BUSD)' };
      }

      await UserModel.insertWithdrawRequest({
        user_id: userId,
        withdrawal_address: address,
        token: token,
        busd_amount: busd_amount,
        status: 0,
      });

      return { success: true };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async getWithdrawHistory(userId: number): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const data = await UserModel.getWithdrawHistory({ user_id: userId });
      return { success: true, data };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
