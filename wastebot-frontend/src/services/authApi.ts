import api from './api';
import { LoginRequest, LoginResponse } from '../types/api';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Using /admin/login as per user spec - gateway should rewrite to /api/admins/login
    // If gateway only strips prefix, use /admin/api/admins/login instead
    const response = await api.post<LoginResponse>('/admin/api/admins/login', credentials);
    return response.data;
  },
};

