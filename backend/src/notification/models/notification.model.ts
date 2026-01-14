import mockData from '../../../libs/data/mockData';
import { DatabaseResult } from '../../../libs/types';

interface NotificationListItem {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string;
  is_read: number;
  created_at: Date;
}

class NotificationModel {
  async list(data: { user_id: number }): Promise<NotificationListItem[]> {
    const notifications = mockData.getNotificationsByUserId(data.user_id);
    return notifications.map(n => ({
      id: n.id || 0,
      user_id: n.user_id,
      type: n.type || '',
      title: n.title,
      body: n.message,
      is_read: n.is_read || 0,
      created_at: n.created_at || new Date(),
    }));
  }

  async markRead(data: { id: number }): Promise<DatabaseResult> {
    return { affectedRows: 1 };
  }
}

export default new NotificationModel();
