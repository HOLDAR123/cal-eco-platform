import { ResponseType } from '../../auth/dto/auth.dto';

export interface NotificationDto {
  id: number;
  user_id: number;
  type: string;
  title: string;
  body: string;
  is_read: number;
  created_at: Date;
}

export type NotificationListResponse = ResponseType<NotificationDto[]>;
export type NotificationResponse = ResponseType<NotificationDto>;
