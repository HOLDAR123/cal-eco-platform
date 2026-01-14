import { Response } from 'express';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { WalletService } from './wallet.service';

const walletService = new WalletService();

export const addWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { address, chain, is_primary } = req.body;
    const result = await walletService.addWallet(req.user_id || 0, address, chain, is_primary);
    res.status(200).send({ success: result.success, msg: result.message, id: result.id });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const listWallets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await walletService.listWallets(req.user_id || 0);
    res.status(200).send({ success: result.success, msg: result.message, data: result.data });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const removeWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await walletService.removeWallet(req.user_id || 0, parseInt(id));
    res.status(200).send({ success: result.success, msg: result.message });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};
