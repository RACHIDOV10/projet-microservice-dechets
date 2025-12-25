import api from './api';
import { Waste, CreateWasteRequest, UpdateWasteRequest, WasteStats } from '../types/api';

export const wasteApi = {
  // Get all wastes
  getAll: async (): Promise<Waste[]> => {
    const response = await api.get<Waste[]>('/waste/api/wastes');
    return response.data;
  },

  // Get waste by ID
  getById: async (id: string): Promise<Waste> => {
    const response = await api.get<Waste>(`/waste/api/wastes/${id}`);
    return response.data;
  },

  // Get wastes by robot ID
  getByRobotId: async (robotId: string): Promise<Waste[]> => {
    const response = await api.get<Waste[]>('/waste/api/wastes');
    // Filter by robotId on client side since backend doesn't have a filter endpoint
    const allWastes = response.data;
    return allWastes.filter(waste => waste.robotId === robotId);
  },

  // Create waste
  create: async (waste: CreateWasteRequest): Promise<Waste> => {
    const response = await api.post<Waste>('/waste/api/wastes/detect', waste);
    return response.data;
  },

  // Update waste status (mark as collected)
  markCollected: async (id: string): Promise<void> => {
    await api.post(`/waste/api/wastes/${id}/collect`);
  },

  // Note: Delete endpoint not available in backend

  // Get waste statistics
  getStats: async (): Promise<WasteStats> => {
    const response = await api.get<WasteStats>('/waste/api/wastes/stats');
    return response.data;
  },
};

