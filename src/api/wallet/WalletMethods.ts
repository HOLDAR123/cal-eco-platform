import Api from '../api';
import { WalletListResponse, WalletResponse, CreateWalletDto } from './dto/wallet.dto';

class WalletMethods extends Api {
  async list() {
    return await this.get<WalletListResponse>('/v1/wallets');
  }

  async add(data: CreateWalletDto) {
    return await this.post<WalletResponse>('/v1/wallets', data);
  }

  async remove(id: number) {
    return await this.delete(`/v1/wallets/${id}`);
  }
}

export default new WalletMethods();
