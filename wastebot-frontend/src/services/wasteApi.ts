import api from './api';
import { Waste, WasteStats } from '../types/api';

export const wasteApi = {
  // ================= READ ALL =================
  getAll: async (): Promise<Waste[]> => {
    const response = await api.get<Waste[]>('/waste/api/wastes');
    return response.data;
  },

  // ================= READ BY ID =================
  getById: async (id: string): Promise<Waste | null> => {
    const response = await api.get<Waste | null>(
      `/waste/api/wastes/${id}`
    );
    return response.data;
  },

  // ================= READ BY ROBOT =================
  getByRobotId: async (robotId: string): Promise<Waste[]> => {
    const response = await api.get<Waste[]>(
      `/waste/api/wastes/robot/${robotId}`
    );
    return response.data;
  },

  // ================= READ BY REGION =================
  getByRegion: async (region: string): Promise<Waste[]> => {
    const response = await api.get<Waste[]>(
      `/waste/api/wastes/region/${region}`
    );
    return response.data;
  },

  // ================= STATS (if exists) =================
  getStats: async (): Promise<WasteStats> => {
    const response = await api.get<WasteStats>(
      '/waste/api/wastes/stats'
    );
    return response.data;
  },

  // ================= MARK AS COLLECTED =================
  markCollected: async (id: string): Promise<void> => {
    await api.put(`/waste/api/wastes/${id}/collect`);
  },
};
