import api from './api';
import { Admin, LoginRequest, LoginResponse, UpdateAdminRequest } from '../types/api';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Using /admin/login as per user spec - gateway should rewrite to /api/admins/login
    // If gateway only strips prefix, use /admin/api/admins/login instead
    const response = await api.post<LoginResponse>('/admin/api/admins/login', credentials);
    return response.data;
  },
 updateAdmin: async (updateData: UpdateAdminRequest): Promise<Admin> => {
    // Extract admin ID from token payload (or store it in localStorage after login)
    const adminId = localStorage.getItem('adminId');
    if (!adminId) throw new Error('Admin ID not found');

    const response = await api.put<Admin>(`/admin/api/admins/${adminId}`, updateData);
    return response.data;
  },
};

