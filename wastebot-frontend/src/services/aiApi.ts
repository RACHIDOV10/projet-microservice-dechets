import api from './api';
import { StreamStatusResponse } from '../types/api';
import { tokenService } from './api';

export const aiApi = {
  // Start streaming for a robot
  startStream: async (robotId: number): Promise<StreamStatusResponse> => {
    const response = await api.post<StreamStatusResponse>(`/ai/robots/${robotId}/start_stream`);
    return response.data;
  },

  // Stop streaming for a robot
  stopStreaming: async (robotId: number): Promise<StreamStatusResponse> => {
    const response = await api.post<StreamStatusResponse>(`/ai/robots/${robotId}/stop_streaming`);
    return response.data;
  },

  // Check if robot should stream
  shouldStream: async (robotId: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/ai/robots/${robotId}/should_stream`);
    return response.data;
  },

  // Get stream URL for video feed (MJPEG stream)
  getStreamUrl: (robotId: number): string => {
    const token = tokenService.getToken();
    const baseUrl = api.defaults.baseURL || 'http://localhost:8082';
    return `${baseUrl}/ai/robots/${robotId}/stream${token ? `?token=${token}` : ''}`;
  },
};

