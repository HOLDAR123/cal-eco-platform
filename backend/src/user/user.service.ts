import UserModel from './models/user.model';
import logger from '../../libs/utils/logger';

export class UserService {
  async getMe(address: string): Promise<{
    success: boolean;
    message?: string;
    data?: {
      id: number;
      address: string;
      token_balance: number;
      MBUSD_balance: number;
      referral_code: string;
    };
  }> {
    try {
      const users = await UserModel.getUsersAddress({ address });
      if (users.length === 0) {
        return { success: false, message: 'User not found' };
      }

      const user = users[0];
      return {
        success: true,
        data: {
          id: user.id,
          address: user.address,
          token_balance: user.token_balance,
          MBUSD_balance: user.MBUSD_balance,
          referral_code: user.referral_code,
        }
      };
    } catch (error) {
      logger.error('Get user error:', error);
      return { success: false, message: 'Internal server error' };
    }
  }
}
