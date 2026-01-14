import { ResponseType } from '../../auth/dto/auth.dto';

export interface PlanDto {
  id: number;
  price: number;
  duration: number;
  token: string;
  staking_percentage: number;
  created_at?: Date;
}

export type PlanListResponse = ResponseType<PlanDto[]>;
export type PlanResponse = ResponseType<PlanDto>;
