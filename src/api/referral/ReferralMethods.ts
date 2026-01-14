import Api from '../api';
import { ReferralListResponse, ReferralEarningsResponse } from './dto/referral.dto';

class ReferralMethods extends Api {
  async list() {
    return await this.get<ReferralListResponse>('/v1/referrals');
  }

  async earnings() {
    return await this.get<ReferralEarningsResponse>('/v1/referrals/earnings');
  }
}

export default new ReferralMethods();
