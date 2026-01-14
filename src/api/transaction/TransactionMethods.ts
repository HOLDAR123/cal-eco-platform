import Api from '../api';
import { TransactionListResponse, TransactionResponse, CreateDepositDto } from './dto/transaction.dto';

class TransactionMethods extends Api {
  async list() {
    return await this.get<TransactionListResponse>('/v1/transactions');
  }

  async createDeposit(data: CreateDepositDto) {
    return await this.post<TransactionResponse>('/v1/transactions/deposits', data);
  }
}

export default new TransactionMethods();
