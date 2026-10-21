import apiClient from '../../../shared/api/axiosInstance'
import type { Maintenance } from '../../../types'

export async function getMaintenances() {
  const response = await apiClient.get<Maintenance[]>('/api/maintenances')
  return response.data
}
