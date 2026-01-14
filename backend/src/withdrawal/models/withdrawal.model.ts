import mockData from '../../../libs/data/mockData';
import { DatabaseResult, WithdrawRequestWithAddress } from '../../../libs/types';

class WithdrawRequestModel {
  async create(data: { user_id: number; withdrawal_address: string; token: number; busd_amount: number }): Promise<DatabaseResult> {
    return mockData.createWithdrawRequest({
      user_id: data.user_id,
      withdrawal_address: data.withdrawal_address,
      token: data.token,
      busd_amount: data.busd_amount,
      status: 0,
    });
  }

  async listByUser(data: { user_id: number }): Promise<WithdrawRequestWithAddress[]> {
    return mockData.getWithdrawRequestsByUserId(data.user_id);
  }
}

export default new WithdrawRequestModel();
