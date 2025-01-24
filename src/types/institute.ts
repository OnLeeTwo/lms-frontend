// src/types/institute.ts

export interface Institute {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
}

export interface InstituteResponse extends Institute {
  message?: string;
}
