import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  Wrench,
  LogOut,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Activity,
} from 'lucide-react'

import { useAuth } from '../features/auth/hooks/useAuth'
import LanguageSwitcher from '../shared/components/LanguageSwitcher'
import Logo from '../shared/components/Logo'

export default function StaffLayout({ role }: { role: 'ADMIN' | 'EMPLOYEE' }) {
  const { t } = useTranslation('common')
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = role === 'ADMIN'

  const basePath = isAdmin ? '/admin' : '/employee'

  const navItems = [
    {
      to: basePath,
      label: t('dashboard'),
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: `${basePath}/cars`,
      label: t('cars'),
      icon: Car,
    },
    {
      to: `${basePath}/bookings`,
      label: t('bookings'),
      icon: CalendarCheck,
    },
    ...(isAdmin
      ? [
          {
            to: '/admin/users',
            label: t('users'),
            icon: Users,
          },
        ]
      : []),
    {
      to: `${basePath}/maintenance`,
      label: t('maintenance'),
      icon: Wrench,
    },
  ]

  const isActive = (to: string, exact = false) => {
    if (exact) return location.pathname === to
    return location.pathname.startsWith(to)
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col md:flex-row text-stone-900 dark:text-stone-100 font-sans antialiased">
      {/* Enterprise Dark Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-stone-900 border-e border-stone-800 text-stone-200 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Nova Drive Home">
            <Logo variant="light" height={36} />
          </Link>
          <span
            className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
              isAdmin
                ? 'bg-amber-950/70 text-amber-400 border-amber-800/60'
                : 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60'
            }`}
          >
            {isAdmin ? 'ADMIN' : 'STAFF'}
          </span>
        </div>

        {/* User Identity Snippet */}
        <div className="px-5 py-4 border-b border-stone-800/50 bg-stone-950/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-sm">
            {isAdmin ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-stone-200 truncate">
              {user?.email}
            </p>
            <p className="text-[11px] text-stone-400 truncate">{t(`roles.${role}`)}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.to, item.exact)
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  active
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-bold'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/70'
                }`}
              >
                <Icon size={17} className={active ? 'text-white' : 'text-stone-400'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Bottom Actions */}
        <div className="p-3 border-t border-stone-800/70 space-y-1.5 bg-stone-950/20">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={13} />
              <span>{t('backToCatalogue')}</span>
            </span>
            <span className="text-[10px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-400">Live</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Operational Header */}
        <header className="h-16 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-6 flex items-center justify-between sticky top-0 z-30">
          {/* Left Title / Breadcrumb */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Activity size={12} className="animate-pulse" />
              <span>{t('dashboard')}</span>
            </span>
            <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
              {isAdmin ? t('admin') : t('employee')}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="h-5 w-[1px] bg-stone-200 dark:bg-stone-800" />

            <button
              onClick={() => {
                signOut()
                navigate('/')
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
              title={t('logout')}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
