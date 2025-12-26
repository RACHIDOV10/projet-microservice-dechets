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
  description:string;
  model:string;
  adminId: number | null;

}

export interface CreateRobotRequest {
  macAddress: string;
  region: string;
  status: boolean; // true = active, false = inactive
  description:string;
  model:string;
  
  adminId?: number;
}

export interface UpdateRobotRequest {
  macAddress?: string;
  region?: string;
  description?:string;
  model?:string;
}

// Waste Types
export interface Waste {
  id: string;
  timestamp:Date;
  region: string;
  category: string;
  robotId: string | null;
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

