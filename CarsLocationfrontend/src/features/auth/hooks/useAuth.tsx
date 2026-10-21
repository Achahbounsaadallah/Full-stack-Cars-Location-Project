import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { login, register, type LoginCredentials, type RegisterData } from '../services/authService'

export type AuthUser = { email: string; role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT' }
type AuthContextValue = {
  user: AuthUser | null
  signIn: (data: LoginCredentials) => Promise<void>
  signUp: (data: RegisterData) => Promise<void>
  signOut: () => void
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readToken(): AuthUser | null {
  const token = localStorage.getItem('nova_token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { email: payload.sub, role: payload.role }
  } catch {
    localStorage.removeItem('nova_token')
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readToken)
  useEffect(() => {
    const expire = () => setUser(null)
    window.addEventListener('auth:expired', expire)
    return () => window.removeEventListener('auth:expired', expire)
  }, [])
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn: async (data) => {
        const result = await login(data)
        localStorage.setItem('nova_token', result.accessToken)
        setUser(readToken())
      },
      signUp: async (data) => {
        await register(data)
        const result = await login({ email: data.email, password: data.password })
        localStorage.setItem('nova_token', result.accessToken)
        setUser(readToken())
      },
      signOut: () => {
        localStorage.removeItem('nova_token')
        setUser(null)
      },
    }),
    [user],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
