import mockData from '../../../libs/data/mockData';
import { DatabaseResult } from '../../../libs/types';

interface TicketMessageListItem {
  id: number;
  ticket_id: number;
  sender: number;
  receiver: number | null;
  message: string;
  datetime: Date;
}

class TicketMessageModel {
  async create(data: { ticket_id: number; sender_id: number; message: string; receiver_id?: number }): Promise<DatabaseResult> {
    return mockData.createTicketMessage({
      ticket_id: data.ticket_id,
      user_id: data.sender_id,
      message: data.message,
      is_admin: data.receiver_id ? 0 : 1,
    });
  }

  async list(data: { ticket_id: number }): Promise<TicketMessageListItem[]> {
    const messages = mockData.getTicketMessagesByTicketId(data.ticket_id);
    return messages.map(m => ({
      id: m.id || 0,
      ticket_id: m.ticket_id,
      sender: m.user_id,
      receiver: m.is_admin ? null : m.user_id,
      message: m.message,
      datetime: m.created_at || new Date(),
    }));
  }
}

export default new TicketMessageModel();
