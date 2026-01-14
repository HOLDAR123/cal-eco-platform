import Api from '../api';
import { WithdrawalListResponse, WithdrawalResponse, CreateWithdrawalDto } from './dto/withdrawal.dto';

class WithdrawalMethods extends Api {
  async list() {
    return await this.get<WithdrawalListResponse>('/v1/withdrawals');
  }

  async create(data: CreateWithdrawalDto) {
    return await this.post<WithdrawalResponse>('/v1/withdrawals', data);
  }

  async cancel(id: number) {
    return await this.delete(`/v1/withdrawals/${id}`);
  }
}

export default new WithdrawalMethods();
