export interface ResponseType<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface AuthMeDto {
  id: number;
  address: string;
  referral_code?: string;
  token_balance?: number;
  MBUSD_balance?: number;
  is_admin?: number;
  datetime?: Date;
}

export interface AuthResponseData {
  id: number;
  address: string;
  referral_code?: string;
  authToken: string;
  is_admin?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: AuthResponseData;
}

export interface LoginDto {
  address: string;
  signature: string;
  referral_address?: string;
}

export interface RegisterDto {
  address: string;
  signature: string;
  referral_address?: string;
}

export interface VerifyEmailResponse {
  verified: boolean;
  message?: string;
}

export interface GoogleOAuthResponse {
  url: string;
}
