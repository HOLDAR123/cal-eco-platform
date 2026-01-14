import AdminModel from './models/admin.model';

export class AdminService {
  async getWithdrawRequests(): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const withdrawRequests = await AdminModel.getWithdrawRequest();
      return {
        success: true,
        message: withdrawRequests.length > 0 ? 'Withdraw requests retrieved successfully' : 'No withdraw requests found',
        data: withdrawRequests
      };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async approveWithdrawRequest(id: number, hash: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const result = await AdminModel.approveWithdrawRequest({ id, hash });
      if (result) {
        return { success: true, message: 'Withdraw request approved successfully' };
      }
      return { success: false, message: 'Failed to approve withdraw request' };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async rejectWithdrawRequest(requestId: number, userId: number, tokenAmount: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const result = await AdminModel.rejectWithdrawRequest({ request_id: requestId });
      if (result) {
        await AdminModel.balanceUpdate({ user_id: userId, token_amount: tokenAmount });
        return { success: true, message: 'Withdraw request rejected successfully' };
      }
      return { success: false, message: 'Failed to reject withdraw request' };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async getUserList(): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const userList = await AdminModel.getUserList();
      return {
        success: true,
        message: userList.length > 0 ? 'User list retrieved successfully' : 'No users found',
        data: userList
      };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async getStakingDetail(): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const stakingDetail = await AdminModel.getStakingDetail();
      return {
        success: true,
        message: stakingDetail.length > 0 ? 'Staking details retrieved successfully' : 'No staking details found',
        data: stakingDetail
      };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async getStakingEarningDetail(): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const stakingEarningDetail = await AdminModel.getStakingEarningDetail();
      return {
        success: true,
        message: stakingEarningDetail.length > 0 ? 'Staking earning details retrieved successfully' : 'No staking earning details found',
        data: stakingEarningDetail
      };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async getDepositBUSDDetail(): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const depositBUSDDetail = await AdminModel.getDepositBUSDDetail();
      return {
        success: true,
        message: depositBUSDDetail.length > 0 ? 'Deposit BUSD details retrieved successfully' : 'No deposit BUSD details found',
        data: depositBUSDDetail
      };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
