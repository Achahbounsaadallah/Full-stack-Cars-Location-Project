import apiClient from '../../../shared/api/axiosInstance'
import type { Booking } from '../../../types'

export async function getMyBookings() {
  const response = await apiClient.get<Booking[]>('/api/v1/bookings/my-bookings')
  return response.data
}

export async function getAllBookings() {
  const response = await apiClient.get<Booking[]>('/api/v1/bookings')
  return response.data
}

export async function getPendingBookings() {
  const response = await apiClient.get<Booking[]>('/api/v1/bookings/pending')
  return response.data
}

export async function createBooking(carId: string, pickupDate: string, returnDate: string) {
  const response = await apiClient.post<Booking>('/api/v1/bookings', {
    carId,
    pickupDate,
    returnDate,
  })
  return response.data
}

export async function updateBookingStatus(id: string, action: 'approve' | 'reject' | 'confirm') {
  const response = await apiClient.patch<Booking>(`/api/v1/bookings/${id}/${action}`)
  return response.data
}

export async function cancelBooking(id: string) {
  const response = await apiClient.patch<Booking>(`/api/v1/bookings/${id}/cancel`)
  return response.data
}
