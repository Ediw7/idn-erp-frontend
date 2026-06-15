import axiosClient from '../../lib/axiosClient';

// Define strict TypeScript interfaces for input and output
export interface LoginCredentials {
  db: string; // The specific Odoo database name
  login: string; // Email or username
  password: string;
}

export interface UserProfile {
  name: string;
  email: string;
  is_admin?: boolean;
}

export interface LoginResponse {
  message?: string;
  uid?: number;
  session_id?: string;
  company_id?: number;
  user?: UserProfile;
  error?: string;
}

export interface LogoutResponse {
  message?: string;
  error?: string;
}

export interface RegisterCredentials {
  db?: string;
  name: string;
  login: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  login: string;
  is_admin: boolean;
  is_active: boolean;
}

export interface UsersResponse {
  status: string;
  data?: UserData[];
  error?: string;
}

/**
 * Feature-specific API module for Authentication.
 * Keeps React UI components completely independent from Axios configurations.
 */
export const authApi = {
  /**
   * Submit credentials to the Odoo backend controller `AuthController.login`.
   * The `axiosClient` will automatically save the `session_id` to the browser's cookie.
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    // We expect a LoginResponse type back from Odoo's json.dumps()
    const response = await axiosClient.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Log the user out from the Odoo backend, invalidating the session.
   */
  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosClient.post<LogoutResponse>('/api/auth/logout');
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<{message?: string; uid?: number; error?: string}> => {
    const response = await axiosClient.post('/api/auth/register', credentials);
    return response.data;
  },

  getUsers: async (): Promise<UserData[]> => {
    const response = await axiosClient.get<UsersResponse>('/api/auth/users');
    if (response.data.status === 'success') {
      return response.data.data || [];
    }
    throw new Error(response.data.error || 'Failed to fetch users');
  },

  toggleUser: async (id: number): Promise<{message?: string; error?: string}> => {
    const response = await axiosClient.post('/api/auth/users/toggle', { id });
    return response.data;
  } };
