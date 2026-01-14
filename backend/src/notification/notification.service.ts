import NotificationModel from './models/notification.model';

export class NotificationService {
  async list(userId: number): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const rows = await NotificationModel.list({ user_id: userId });
      return { success: true, data: rows };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async markRead(userId: number, notificationId: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      await NotificationModel.markRead({ id: notificationId });
      return { success: true };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
