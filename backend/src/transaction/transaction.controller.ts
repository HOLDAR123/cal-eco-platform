import { Response } from 'express';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { TransactionService } from './transaction.service';

const transactionService = new TransactionService();

export const createDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await transactionService.createDeposit(
      req.user_id || 0,
      req.address || '',
      req.body.busd_amount,
      req.body.hash
    );
    res.status(result.success ? 200 : 403).send({ success: result.success, msg: result.message });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await transactionService.getTransactionHistory(req.user_id || 0);
    res.status(200).send({ success: result.success, msg: result.message, data: result.data });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};
