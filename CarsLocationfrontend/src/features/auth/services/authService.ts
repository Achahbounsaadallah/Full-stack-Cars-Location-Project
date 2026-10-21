import apiClient from '../../../shared/api/axiosInstance'
import type { User } from '../../../types'

export type LoginCredentials = { email: string; password: string }
export type RegisterData = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export async function login(credentials: LoginCredentials) {
  const { data } = await apiClient.post<{ accessToken: string }>('/api/auth/login', credentials)
  return data
}

export async function register(payload: RegisterData) {
  const { data } = await apiClient.post<User>('/api/auth/register', payload)
  return data
}
