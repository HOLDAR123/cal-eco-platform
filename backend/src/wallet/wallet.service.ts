import WalletModel from './models/wallet.model';

export class WalletService {
  async addWallet(userId: number, address: string, chain?: string, isPrimary?: boolean): Promise<{
    success: boolean;
    message?: string;
    id?: number;
  }> {
    try {
      if (!address) {
        return { success: false, message: 'Address required' };
      }
      const result = await WalletModel.addWallet({
        user_id: userId,
        address,
        chain: chain || 'bsc',
        is_primary: !!isPrimary
      });
      return { success: true, id: result.insertId };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async listWallets(userId: number): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const rows = await WalletModel.listWallets({ user_id: userId });
      return { success: true, data: rows };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async removeWallet(userId: number, walletId: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      await WalletModel.removeWallet({ user_id: userId, id: walletId });
      return { success: true };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
