import StakingPlanModel from './models/plan.model';

export class PlanService {
  async getPlans(): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const data = await StakingPlanModel.list();
      return {
        success: true,
        data
      };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
