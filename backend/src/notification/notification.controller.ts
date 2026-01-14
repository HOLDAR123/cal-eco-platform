import { Response } from 'express';
import { AuthRequest } from '../../libs/middleware/auth.middleware';
import { NotificationService } from './notification.service';

const notificationService = new NotificationService();

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await notificationService.list(req.user_id || 0);
    res.status(200).send({ success: result.success, msg: result.message, data: result.data });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};

export const markRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await notificationService.markRead(req.user_id || 0, parseInt(id));
    res.status(200).send({ success: result.success, msg: result.message });
  } catch (_e) {
    res.status(200).send({ success: false, msg: 'Internal error' });
  }
};
