// src/types/api.ts

/** The base URL for the backend API */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/** Standard structure for a failed API response */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/** Interface for standard successful response wrapper */
export interface ApiResponse<T> {
  success: true;
  data: T;
}