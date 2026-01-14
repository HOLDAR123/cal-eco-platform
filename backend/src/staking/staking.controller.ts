import { Response } from 'express';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { StakingService } from './staking.service';

const stakingService = new StakingService();

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await stakingService.createStaking(
      req.user_id || 0,
      req.address || '',
      {
        staking_period_id: req.body.staking_period_id,
        quantity: req.body.quantity,
        busd_amount: req.body.busd_amount,
        hash: req.body.hash
      }
    );
    res.status(200).send({ success: result.success, msg: result.message, id: result.id });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await stakingService.getStakingHistory(req.user_id || 0);
    res.status(200).send({ success: result.success, msg: result.message, data: result.data });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const claim = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await stakingService.claimReward(
      req.user_id || 0,
      req.body.staking_id,
      req.body.staking_period_id
    );
    res.status(200).send({ success: result.success, msg: result.message });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const sell = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await stakingService.sellPlan(
      req.user_id || 0,
      req.body.staking_id,
      req.body.staking_period_id
    );
    res.status(200).send({ success: result.success, msg: result.message });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};
