import Api from '../api';
import { NotificationListResponse } from './dto/notification.dto';

class NotificationMethods extends Api {
  async list() {
    return await this.get<NotificationListResponse>('/v1/notifications');
  }

  async markRead(id: number) {
    return await this.post(`/v1/notifications/${id}/read`);
  }
}

export default new NotificationMethods();
