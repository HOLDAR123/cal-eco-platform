import Api from '../api';
import { TicketListResponse, TicketResponse, TicketMessageListResponse, CreateTicketDto, AddMessageDto } from './dto/ticket.dto';

class TicketMethods extends Api {
  async list() {
    return await this.get<TicketListResponse>('/v1/tickets');
  }

  async create(data: CreateTicketDto) {
    return await this.post<TicketResponse>('/v1/tickets', data);
  }

  async messages(id: number) {
    return await this.get<TicketMessageListResponse>(`/v1/tickets/${id}/messages`);
  }

  async addMessage(id: number, data: AddMessageDto) {
    return await this.post(`/v1/tickets/${id}/messages`, data);
  }
}

export default new TicketMethods();
