import mockData from '../../../libs/data/mockData';
import { WalletData, DatabaseResult } from '../../../libs/types';

class WalletModel {
  async addWallet(data: Partial<WalletData>): Promise<DatabaseResult> {
    return mockData.createWallet(data);
  }

  async listWallets(data: { user_id: number }): Promise<WalletData[]> {
    const wallets = mockData.getWalletsByUserId(data.user_id);
    return wallets.map(w => ({
      id: w.id,
      user_id: w.user_id,
      address: w.address,
      chain: w.chain,
      is_primary: w.is_primary,
      created_at: w.created_at,
    }));
  }

  async removeWallet(data: { id: number; user_id: number }): Promise<DatabaseResult> {
    return mockData.deleteWallet(data.id, data.user_id);
  }
}

export default new WalletModel();
