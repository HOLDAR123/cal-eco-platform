import { Request, Response } from 'express';
import { PlanService } from './plan.service';

const planService = new PlanService();

export const list = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await planService.getPlans();
    res.status(200).send({ success: result.success, msg: result.message, data: result.data });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const detail = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).send({ success: false, msg: 'Not implemented' });
};
