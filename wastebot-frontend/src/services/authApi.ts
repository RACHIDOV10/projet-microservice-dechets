import api from './api';
import { LoginRequest, LoginResponse, Admin } from '../types/api';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/admin/api/admins/login', credentials);
    return response.data;
  },

  // Get current admin info (if backend provides this endpoint)
  getCurrentAdmin: async (): Promise<Admin> => {
    const response = await api.get<Admin>('/admin/api/admins/me');
    return response.data;
  },
};

