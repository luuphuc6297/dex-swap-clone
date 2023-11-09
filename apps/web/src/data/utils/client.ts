/* eslint-disable class-methods-use-this */
import type { AxiosResponse } from 'axios';
import axios from 'axios';

export const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const responseBody = (response: AxiosResponse) => response.data;

class HttpClient {
  async get<T>(endpoint: string, query?: any): Promise<T> {
    const response = await Axios.get(endpoint, { params: query });
    return responseBody(response);
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await Axios.post(endpoint, body);
    return responseBody(response);
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await Axios.put(endpoint, body);
    return responseBody(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await Axios.delete(endpoint);
    return responseBody(response);
  }
}

export default new HttpClient();
