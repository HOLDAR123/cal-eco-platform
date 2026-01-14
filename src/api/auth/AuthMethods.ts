import axios, { AxiosError } from 'axios';
import { ACCESS_TOKEN_LOCAL_STORAGE } from '../../constants/common';
import Api from '../api';
import {
  AuthMeDto,
  AuthResponseData,
  LoginDto,
  RegisterDto,
  ResponseType,
  VerifyEmailResponse,
} from './dto/auth.dto';

class AuthMethods extends Api {
  async authMe() {
    try {
      if (!this.token) return null;

      const res = await this.get<ResponseType<AuthMeDto>>('/v1/auth/me');

      if (!res.success) {
        throw new Error('Token expired!');
      }

      return res.data;
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.data?.message === 'Unauthenticated.'
      ) {
        localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
        this.token = null;
      }
      if (error instanceof AxiosError && error.response?.status === 403) {
        localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
        this.token = null;
      }

      throw error;
    }
  }

  async login(data: LoginDto) {
    const res = await this.post<ResponseType<AuthResponseData>>('/v1/auth/login-signature', data);
    if (res.data?.authToken) {
      localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, res.data.authToken);
      this.updateToken();
    }
    return res.data;
  }

  async register(data: RegisterDto) {
    try {
      const res = await this.post<ResponseType<AuthResponseData>>('/v1/auth/login-signature', data);
      if (res.data?.authToken) {
        localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, res.data.authToken);
        this.updateToken();
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const res = await this.post('/v1/auth/logout');
      localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
      this.token = null;
      return res;
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
      this.token = null;
      throw error;
    }
  }

  async refresh() {
    return await this.post<ResponseType<{ authToken: string }>>('/v1/auth/refresh');
  }

  async verifyEmail(address: string) {
    return await axios.get<ResponseType<VerifyEmailResponse>>(address, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export default new AuthMethods();
