import Api from '../api';
import { PlanListResponse, PlanResponse } from './dto/plan.dto';

class PlanMethods extends Api {
  async list() {
    return await this.get<PlanListResponse>('/v1/plans');
  }

  async detail(id: number) {
    return await this.get<PlanResponse>(`/v1/plans/${id}`);
  }
}

export default new PlanMethods();
