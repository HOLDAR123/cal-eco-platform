import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ACCESS_TOKEN_LOCAL_STORAGE } from '../constants/common';

export default class Api {
  protected address: string =
    process.env.REACT_APP_BACKEND_URL || 'http://localhost:1357/api';
  protected token: string | null = null;

  protected updateToken(): void {
    const token = localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE);
    this.token = token;
  }

  constructor() {
    this.updateToken();
    window.addEventListener('storage', this.updateToken.bind(this));
  }

  private async request<RES>(
    method: string,
    config: AxiosRequestConfig,
  ): Promise<RES> {
    try {
      this.updateToken();

      const url = this.address.endsWith('/') 
        ? `${this.address}${method.startsWith('/') ? method.slice(1) : method}`
        : `${this.address}${method.startsWith('/') ? method : `/${method}`}`;

      const response: AxiosResponse<RES> = await axios(url, {
        ...config,
        headers: {
          Authorization: this.token ? `Bearer ${this.token}` : undefined,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const isNetworkError = error.code === 'ERR_NETWORK' || error.message === 'Network Error';

      if (isNetworkError) {
        console.warn('Backend server is not available. Please make sure the backend is running on', this.address);
        return;
      }

      if (status === 401) {
        localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE);
        this.token = null;
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }

      if (error.response?.data) {
        console.error('Axios error:', error.response.data);
      } else {
        console.error('Axios error:', error.message);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }

  get<RES>(url: string, config?: AxiosRequestConfig): Promise<RES> {
    return this.request<RES>(url, { ...config, method: 'GET' });
  }

  post<RES, DATA = unknown>(
    url: string,
    data?: DATA,
    config?: AxiosRequestConfig,
  ): Promise<RES> {
    return this.request<RES>(url, { ...config, method: 'POST', data });
  }

  put<RES, DATA = unknown>(
    url: string,
    data?: DATA,
    config?: AxiosRequestConfig,
  ): Promise<RES> {
    return this.request<RES>(url, { ...config, method: 'PUT', data });
  }

  delete<RES, DATA = unknown>(
    url: string,
    data?: DATA,
    config?: AxiosRequestConfig,
  ): Promise<RES> {
    return this.request<RES>(url, { ...config, method: 'DELETE', data });
  }

  patch<RES, DATA = unknown>(
    url: string,
    data?: DATA,
    config?: AxiosRequestConfig,
  ): Promise<RES> {
    return this.request<RES>(url, { ...config, method: 'PATCH', data });
  }
}

export const api = new Api();
