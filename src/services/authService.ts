import { apiClient } from '@/lib/apiClient';
import type { AuthResponse, User } from '@/types';

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/api/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    apiClient.post<AuthResponse>('/api/auth/register', { name, email, password }),

  getProfile: () =>
    apiClient.get<User>('/api/auth/me'),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<User>('/api/auth/profile', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.put<void>('/api/auth/password', { current_password: currentPassword, new_password: newPassword }),
};
