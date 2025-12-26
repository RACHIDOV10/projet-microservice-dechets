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
    const response = await api.post<Robot>(
      '/robot/api/robots',
      robot
    );
    return response.data;
  },

  // Update robot
  update: async (
    id: number,
    robot: UpdateRobotRequest
  ): Promise<Robot> => {
    const response = await api.put<Robot>(
      `/robot/api/robots/${id}`,
      robot
    );
    return response.data;
  },

  // Delete robot
  delete: async (id: number): Promise<void> => {
    await api.delete(`/robot/api/robots/${id}`);
  },

  // Activate robot
  activate: async (id: number): Promise<void> => {
    await api.post(`/robot/api/robots/${id}/activate`);
  },

  // Deactivate robot
  deactivate: async (id: number): Promise<void> => {
    await api.post(`/robot/api/robots/${id}/deactivate`);
  },
};
