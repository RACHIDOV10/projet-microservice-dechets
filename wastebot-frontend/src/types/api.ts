// API Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Robot Types
export interface Robot {
  id: number;
  macAddress: string;
  status: boolean; // true = active, false = inactive
  region: string;
  address: string;
  adminId: number | null;
  wasteIds: string[];
}

export interface CreateRobotRequest {
  macAddress: string;
  region: string;
  address: string;
  adminId?: number;
}

export interface UpdateRobotRequest {
  macAddress?: string;
  region?: string;
  address?: string;
  adminId?: number;
}

// Waste Types
export interface Waste {
  id: string;
  type: string;
  quantity: number;
  robotId: string | null;
  status: string; // "detected", "collected", "pending", "in_progress"
}

export interface CreateWasteRequest {
  type: string;
  quantity: number;
  robotId?: string;
  status?: string;
}

export interface UpdateWasteRequest {
  type?: string;
  quantity?: number;
  robotId?: string;
  status?: string;
}

export interface WasteStats {
  total: number;
  detected: number;
  collected: number;
}

// AI Service Types
export interface StreamStatusResponse {
  streaming: boolean;
}

export interface ShouldStreamResponse {
  [key: string]: boolean;
}

// Admin Types
export interface Admin {
  id: string;
  name: string;
  email: string;
}

