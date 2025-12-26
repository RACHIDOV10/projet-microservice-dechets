import api from './api';
import { Waste, WasteStats } from '../types/api';

// READ-ONLY Waste API - No write operations
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
    const response = await api.get<Waste[]>(
      `/waste/api/wastes/robot/${robotId}`
    );
    return response.data;
  },

  // Get wastes by region
  getByRegion: async (region: string): Promise<Waste[]> => {
    const response = await api.get<Waste[]>(
      `/waste/api/wastes/region/${region}`
    );
    return response.data;
  },

  // Get waste statistics
  getStats: async (): Promise<WasteStats> => {
    const response = await api.get<WasteStats>('/waste/api/wastes/stats');
    return response.data;
  },
};
