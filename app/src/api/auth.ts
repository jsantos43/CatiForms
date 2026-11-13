import { request } from './client';
import type { User } from './types';

export type LoginData = { username: string; password: string };

export type SignupData = LoginData & { email: string };

export const login = async (data: LoginData) => {
  const res = await request<{ user: User }>('/auth/login', {
    method: 'POST',
    body: data,
    skipRefresh: true,
  });
  return res.user;
};

export const logout = () => request('/auth/logout', { method: 'POST', skipRefresh: true });

export const getCurrentUser = async () => {
  const res = await request<{ user: User }>('/user');
  return res.user;
};

export const signup = async (data: SignupData) => {
  const res = await request<{ user: User }>('/user', {
    method: 'POST',
    body: data,
    skipRefresh: true,
  });
  return res.user;
};
