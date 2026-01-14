import mockData from '../../../libs/data/mockData';
import { DatabaseResult, TicketData } from '../../../libs/types';

class TicketModel {
  async create(data: { user_id: number; subject: string }): Promise<DatabaseResult> {
    return mockData.createTicket({
      user_id: data.user_id,
      subject: data.subject,
      status: 'open',
    });
  }

  async list(data: { user_id: number }): Promise<TicketData[]> {
    return mockData.getTicketsByUserId(data.user_id);
  }
}

export default new TicketModel();
