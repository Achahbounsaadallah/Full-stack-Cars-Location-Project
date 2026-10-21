import apiClient from '../../../shared/api/axiosInstance'
import type { User } from '../../../types'

export async function getUsers() {
  const response = await apiClient.get<User[]>('/api/v1/users')
  return response.data
}

export async function deleteUser(id: string) {
  await apiClient.delete(`/api/v1/users/${id}`)
}
