import UserModel from '../user/models/user.model';
import config from '../../libs/configs/config';

export class TransactionService {
  async createDeposit(userId: number, address: string, busdAmount: number, hash: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const exists = await UserModel.checkHash({ hash });
      if (exists.length > 0) {
        return { success: false, message: 'Forbidden' };
      }

      await UserModel.saveDepositBUSDDetails({
        user_id: userId,
        address: address,
        from_address: address,
        to_address: config.clientDepositAddress,
        busd_amount: busdAmount,
        token: parseFloat(busdAmount.toString()) * 10,
        hash: hash,
        transaction_type_id: 1,
        status: 1,
      });

      return { success: true, message: 'Deposit recorded. Awaiting blockchain confirmation.' };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async getTransactionHistory(userId: number): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const data = await UserModel.getTransactionHistory({ user_id: userId });
      return { success: true, data };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
