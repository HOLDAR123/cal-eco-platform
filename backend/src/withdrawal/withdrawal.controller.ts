import { Response } from 'express';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { EmptyRequest } from '../../libs/types';
import { WithdrawalService } from './withdrawal.service';

const withdrawalService = new WithdrawalService();

export const request = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await withdrawalService.createWithdrawRequest(
      req.user_id || 0,
      req.address || '',
      req.body.token
    );
    res.status(200).send({ success: result.success, msg: result.message });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await withdrawalService.getWithdrawHistory(req.user_id || 0);
    res.status(200).send({ success: result.success, msg: result.message, data: result.data });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const cancel = async (_req: EmptyRequest, res: Response): Promise<void> => {
  res.status(200).send({ success: false, msg: 'Not implemented' });
};
