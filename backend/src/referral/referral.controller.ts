import { Response } from 'express';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { EmptyRequest } from '../../libs/types';
import { ReferralService } from './referral.service';

const referralService = new ReferralService();

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await referralService.getReferralUsersList(req.user_id || 0);
    res.status(200).send({ success: result.success, msg: result.message, data: result.data });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const earnings = async (_req: EmptyRequest, res: Response): Promise<void> => {
  res.status(200).send({ success: false, msg: 'Not implemented' });
};
