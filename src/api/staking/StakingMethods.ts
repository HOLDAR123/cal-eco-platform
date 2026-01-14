import Api from '../api';
import { StakingListResponse, StakingResponse, CreateStakingDto, ClaimStakingDto, SellStakingDto } from './dto/staking.dto';

class StakingMethods extends Api {
  async list() {
    return await this.get<StakingListResponse>('/v1/staking');
  }

  async create(data: CreateStakingDto) {
    return await this.post<StakingResponse>('/v1/staking', data);
  }

  async claim(data: ClaimStakingDto) {
    return await this.post('/v1/staking/claim', data);
  }

  async sell(data: SellStakingDto) {
    return await this.post('/v1/staking/sell', data);
  }
}

export default new StakingMethods();
