import api from './api';
import { Robot, CreateRobotRequest, UpdateRobotRequest } from '../types/api';

export const robotApi = {
  // Get all robots
  getAll: async (): Promise<Robot[]> => {
    const response = await api.get<Robot[]>('/robot/api/robots');
    return response.data;
  },

  // Get robot by ID
  getById: async (id: number): Promise<Robot> => {
    const response = await api.get<Robot>(`/robot/api/robots/${id}`);
    return response.data;
  },

  // Create robot
  create: async (robot: CreateRobotRequest): Promise<Robot> => {
    const response = await api.post<Robot>('/robot/api/robots', robot);
    return response.data;
  },

  // Activate robot
  activate: async (id: number): Promise<void> => {
    await api.post(`/robot/api/robots/${id}/activate`);
  },

  // Deactivate robot
  deactivate: async (id: number): Promise<void> => {
    await api.post(`/robot/api/robots/${id}/deactivate`);
  },

  // Note: Delete endpoint not available in backend controller
  // For now, we'll skip delete functionality
};

