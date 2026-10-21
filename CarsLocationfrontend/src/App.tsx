import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './features/auth/hooks/useAuth'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'
import CarsPage from './features/cars/pages/CarsPage'
import CarDetailsPage from './features/cars/pages/CarDetailsPage'
import MyBookingsPage from './features/bookings/pages/MyBookingsPage'
import StaffDashboardPage from './features/dashboard/pages/StaffDashboardPage'
import UsersPage from './features/users/pages/UsersPage'
import AdminBookingsPage from './features/bookings/pages/AdminBookingsPage'
import MaintenancePage from './features/cars/pages/MaintenancePage'
import AdminCarsPage from './features/cars/pages/AdminCarsPage'
import ClientLayout from './layouts/ClientLayout'
import StaffLayout from './layouts/StaffLayout'
import ProtectedRoute from './app/routes/ProtectedRoute'
import RoleRoute from './app/routes/RoleRoute'

function HomeRedirect() {
  const { user } = useAuth()
  if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />
  if (user?.role === 'EMPLOYEE') return <Navigate to="/employee" replace />
  return <CarsPage />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cars/:id" element={<CarDetailsPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/client/bookings" element={<MyBookingsPage />} />
          </Route>
        </Route>
        <Route element={<RoleRoute roles={['ADMIN']} />}>
          <Route element={<StaffLayout role="ADMIN" />}>
            <Route path="/admin" element={<StaffDashboardPage admin />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/cars" element={<AdminCarsPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/maintenance" element={<MaintenancePage />} />
            <Route path="/admin/*" element={<StaffDashboardPage admin />} />
          </Route>
        </Route>
        <Route element={<RoleRoute roles={['EMPLOYEE']} />}>
          <Route element={<StaffLayout role="EMPLOYEE" />}>
            <Route path="/employee" element={<StaffDashboardPage />} />
            <Route path="/employee/*" element={<StaffDashboardPage />} />
            <Route path="/employee/maintenance" element={<MaintenancePage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
