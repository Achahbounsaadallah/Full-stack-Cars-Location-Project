import apiClient from '../../../shared/api/axiosInstance'
import type { Car, Category } from '../../../types'

export async function getCars() {
  const response = await apiClient.get<Car[]>('/api/v1/cars')
  return response.data
}

export async function getCategories() {
  const response = await apiClient.get<Category[]>('/api/v1/categories')
  return response.data
}

export async function getCar(id: string) {
  const response = await apiClient.get<Car>(`/api/v1/cars/${id}`)
  return response.data
}

export async function getAvailableCars(pickupDate: string, returnDate: string) {
  const response = await apiClient.get<Car[]>('/api/v1/cars/available', {
    params: { startDate: pickupDate, endDate: returnDate },
  })
  return response.data
}

export async function createCar(payload: unknown) {
  const response = await apiClient.post<Car>('/api/v1/cars', payload)
  return response.data
}

export async function updateCar(id: string, payload: unknown) {
  const response = await apiClient.put<Car>(`/api/v1/cars/${id}`, payload)
  return response.data
}

export async function deleteCar(id: string) {
  await apiClient.delete(`/api/v1/cars/${id}`)
}
