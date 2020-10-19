import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface RequestConfig extends AxiosRequestConfig {}
export interface Response<T=unknown> extends AxiosResponse<T> {}

export interface Request {
  get<T>(url: string, config: RequestConfig): Promise<Response<T>>
  isRequestError(error: AxiosError): boolean;
}

export const request: Request = {
  get<T>(url: string, config: RequestConfig) {
    return axios.get<T, Response<T>>(url, config);
  },

  isRequestError(error: AxiosError) {
    return !!(error.response && error.response.status);
  }
};
