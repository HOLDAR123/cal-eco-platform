import { Request, Response } from 'express';
import UserModel from '../user/models/user.model';

export const bscDepositConfirmed = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transaction_id, busd_amount, token, user_id } = req.body;
    if (!transaction_id) {
      res.status(400).send({ success: false, msg: 'transaction_id required' });
      return;
    }
    await UserModel.userBalanceUpdate({ id: transaction_id, busd_amount, token, user_id });
    res.status(200).send({ success: true });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};
