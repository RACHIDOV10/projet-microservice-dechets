import api from './api';
import { StreamStatusResponse, ShouldStreamResponse } from '../types/api';

export const aiApi = {
  // Request streaming for a robot
  requestStream: async (robotId: string): Promise<StreamStatusResponse> => {
    const response = await api.post<StreamStatusResponse>(`/ai/robots/${robotId}/request_stream`);
    return response.data;
  },

  // Stop streaming for a robot
  stopStream: async (robotId: string): Promise<StreamStatusResponse> => {
    const response = await api.post<StreamStatusResponse>(`/ai/robots/${robotId}/stop_stream`);
    return response.data;
  },

  // Check if robot should stream
  shouldStream: async (robotId: string): Promise<boolean> => {
    const response = await api.get<boolean>(`/ai/robots/${robotId}/should_stream`);
    return response.data;
  },

  // Get stream URL for video feed (MJPEG stream)
  getStreamUrl: (robotId: string): string => {
    const token = localStorage.getItem('token');
    return `http://localhost:8082/ai/robots/${robotId}/stream${token ? `?token=${token}` : ''}`;
  },
};

