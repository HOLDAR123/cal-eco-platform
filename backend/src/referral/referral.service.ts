import UserModel from '../user/models/user.model';

export class ReferralService {
  async getReferralUsersList(userId: number): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const data = await UserModel.getReferralUsersList({ user_id: userId });
      return { success: true, data };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
