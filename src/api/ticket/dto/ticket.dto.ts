import { ResponseType } from '../../auth/dto/auth.dto';

export interface TicketDto {
  id: number;
  user_id: number;
  subject: string;
  status: string;
  created_at: Date;
}

export interface TicketMessageDto {
  id: number;
  ticket_id: number;
  sender: number;
  receiver: number | null;
  message: string;
  datetime: Date;
}

export interface CreateTicketDto {
  subject: string;
}

export interface AddMessageDto {
  message: string;
}

export type TicketListResponse = ResponseType<TicketDto[]>;
export type TicketResponse = ResponseType<TicketDto>;
export type TicketMessageListResponse = ResponseType<TicketMessageDto[]>;
