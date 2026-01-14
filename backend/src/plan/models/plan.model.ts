import mockData from '../../../libs/data/mockData';
import { PlanDetailItem } from '../../../libs/types';

class StakingPlanModel {
  async list(): Promise<PlanDetailItem[]> {
    return mockData.getStakingPlans();
  }

  async find(id: number): Promise<PlanDetailItem | null> {
    return mockData.getStakingPlanById(id);
  }
}

export default new StakingPlanModel();
