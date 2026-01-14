import TicketModel from './models/ticket.model';
import TicketMessageModel from './models/ticketMessage.model';

export class TicketService {
  async create(userId: number, subject: string): Promise<{
    success: boolean;
    message?: string;
    id?: number;
  }> {
    try {
      if (!subject) {
        return { success: false, message: 'Subject is required' };
      }

      const result = await TicketModel.create({ user_id: userId, subject });
      return { success: true, message: 'Ticket created successfully', id: result.insertId };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async list(userId: number): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const rows = await TicketModel.list({ user_id: userId });
      return { success: true, message: 'Tickets retrieved successfully', data: rows };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async getMessages(ticketId: number): Promise<{
    success: boolean;
    message?: string;
    data?: unknown[];
  }> {
    try {
      const rows = await TicketMessageModel.list({ ticket_id: ticketId });
      return { success: true, message: 'Messages retrieved successfully', data: rows };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }

  async addMessage(ticketId: number, userId: number, message: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      if (!message) {
        return { success: false, message: 'Message is required' };
      }

      await TicketMessageModel.create({ ticket_id: ticketId, sender_id: userId, message });
      return { success: true, message: 'Message added successfully' };
    } catch (_e) {
      return { success: false, message: 'Internal error' };
    }
  }
}
