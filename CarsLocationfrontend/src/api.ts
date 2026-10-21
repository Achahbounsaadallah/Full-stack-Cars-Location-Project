import type { AvailabilityCheck, Booking, Car, Category, Maintenance, User } from './types'

/**
 * (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
 */
const API_URL = ''

async function request<T>(path: string, init: RequestInit = {}) {
  const token = localStorage.getItem('nova_token')
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('nova_token')
    const body = await response.text()
    throw new Error(body || `Erreur ${response.status} sur ${path}`)
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>)
}

export const api = {
  cars: () => request<Car[]>('/api/v1/cars'),
  createCar: (data: unknown) =>
    request<Car>('/api/v1/cars', { method: 'POST', body: JSON.stringify(data) }),
  availableCars: (start: string, end: string) =>
    request<Car[]>(
      `/api/v1/cars/available?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`,
    ),
  car: (id: string) => request<Car>(`/api/v1/cars/${id}`),
  updateCar: (id: string, data: unknown) =>
    request<Car>(`/api/v1/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCar: (id: string) => request<void>(`/api/v1/cars/${id}`, { method: 'DELETE' }),
  categories: () => request<Category[]>('/api/v1/categories'),
  category: (id: string) => request<Category>(`/api/v1/categories/${id}`),
  createCategory: (data: unknown) =>
    request<Category>('/api/v1/categories', { method: 'POST', body: JSON.stringify(data) }),
  checkAvailability: (carId: string, start: string, end: string) =>
    request<AvailabilityCheck>(
      `/api/v1/availabilities/check?carId=${encodeURIComponent(carId)}&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}`,
    ),
  carAvailabilities: (carId: string) =>
    request<AvailabilityCheck[]>(`/api/v1/availabilities/car/${carId}`),
  maintenanceAvailabilities: () =>
    request<AvailabilityCheck[]>('/api/v1/availabilities/maintenance'),
  blockCar: (data: unknown) =>
    request<AvailabilityCheck>('/api/v1/availabilities/block', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<{ accessToken: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  register: (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
  }) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  bookings: () => request<Booking[]>('/api/v1/bookings/my-bookings'),
  allBookings: () => request<Booking[]>('/api/v1/bookings'),
  pendingBookings: () => request<Booking[]>('/api/v1/bookings/pending'),
  createBooking: (carId: string, pickupDate: string, returnDate: string) =>
    request<Booking>('/api/v1/bookings', {
      method: 'POST',
      body: JSON.stringify({ carId, pickupDate, returnDate }),
    }),
  cancelBooking: (id: string) =>
    request<Booking>(`/api/v1/bookings/${id}/cancel`, { method: 'PATCH' }),
  approveBooking: (id: string) =>
    request<Booking>(`/api/v1/bookings/${id}/approve`, { method: 'PATCH' }),
  rejectBooking: (id: string) =>
    request<Booking>(`/api/v1/bookings/${id}/reject`, { method: 'PATCH' }),
  confirmBooking: (id: string) =>
    request<Booking>(`/api/v1/bookings/${id}/confirm`, { method: 'PATCH' }),
  users: () => request<User[]>('/api/v1/users'),
  user: (id: string) => request<User>(`/api/v1/users/${id}`),
  createUser: (data: unknown) =>
    request<User>('/api/v1/users', { method: 'POST', body: JSON.stringify(data) }),
  updateUser: (id: string, data: unknown) =>
    request<User>(`/api/v1/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: string) => request<void>(`/api/v1/users/${id}`, { method: 'DELETE' }),
  maintenances: () => request<Maintenance[]>('/api/maintenances'),
  carMaintenances: (carId: string) => request<Maintenance[]>(`/api/maintenances/car/${carId}`),
  maintenancesByStatus: (status: string) =>
    request<Maintenance[]>(`/api/maintenances/status?status=${encodeURIComponent(status)}`),
  createMaintenance: (carId: string, data: unknown) =>
    request<Maintenance>(`/api/maintenances/car/${carId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMaintenance: (id: string, data: unknown) =>
    request<Maintenance>(`/api/maintenances/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  completeMaintenance: (id: string, cost: number) =>
    request<Maintenance>(`/api/maintenances/${id}/complete?cost=${encodeURIComponent(cost)}`, {
      method: 'PATCH',
    }),
  deleteMaintenance: (id: string) => request<void>(`/api/maintenances/${id}`, { method: 'DELETE' }),
}
