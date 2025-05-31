import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { config } from '../config';
import { ApiError } from '../types';

export class ApiClient {
  private client: AxiosInstance;
  private authToken?: string;

  constructor(baseURL?: string) {
    this.client = axios.create({
      baseURL: baseURL || config.magento.baseUrl,
      timeout: config.test.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        if (config.data) {
          // eslint-disable-next-line no-console
          console.log(
            `${config.method?.toUpperCase()} ${config.url}`,
            JSON.stringify(config.data, null, 2),
          );
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError<ApiError>) => {
        if (error.response?.data) {
          const apiError = error.response.data;
          console.error(`API Error: ${apiError.message}`);
          if (apiError.errors) {
            apiError.errors.forEach((err) => {
              console.error(`  - ${err.message}`);
            });
          }
        }
        return Promise.reject(error);
      },
    );
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}
