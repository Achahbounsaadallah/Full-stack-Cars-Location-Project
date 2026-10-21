import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, type AuthUser } from '../../features/auth/hooks/useAuth'

export default function RoleRoute({ roles }: { roles: AuthUser['role'][] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return roles.includes(user.role) ? <Outlet /> : <Navigate to="/" replace />
}
