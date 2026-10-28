export type Category = {
  id: string
  name: string
  description?: string
  minimumSeats?: number
  baseDailyPrice?: number
}
export type Car = {
  id: string
  registrationNumber: string
  brand: string
  model: string
  productionYear: number
  seats: number
  transmission: string
  fuelType: string
  dailyBasePrice: number
  status: string
  mileage?: number
  description?: string
  category?: Category
}
export type Booking = {
  id: string
  bookingNumber: string
  carId: string
  carBrandModel: string
  clientEmail: string
  clientNumber?: string
  pickupDate: string
  returnDate: string
  status: string
  totalAmount: number
  createdAt: string
}
export type Search = { pickupDate: string; returnDate: string }
export type AvailabilityCheck = {
  id?: string
  carId: string
  available?: boolean
  startDate: string
  endDate: string
  status?: string
  reason?: string
}
export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type Maintenance = {
  id: string
  description?: string
  startDate: string
  endDate?: string
  status: MaintenanceStatus
  cost?: number
  car?: Car
}
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  status: UserStatus | string
  createdAt: string
  updatedAt?: string
}

