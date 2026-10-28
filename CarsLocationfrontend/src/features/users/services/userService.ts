import apiClient from '../../../shared/api/axiosInstance'
import type { User } from '../../../types'

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  role?: string
}

export async function getUsers() {
  const response = await apiClient.get<User[]>('/api/v1/users')
  return response.data
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  try {
    const response = await apiClient.post<User>('/api/v1/users', payload)
    return response.data
  } catch (err: any) {
    if (err?.response?.status === 404 || err?.response?.status === 405) {
      const response = await apiClient.post<User>('/api/auth/register', payload)
      return response.data
    }
    throw err
  }
}

export async function deleteUser(id: string) {
  await apiClient.delete(`/api/v1/users/${id}`)
}
