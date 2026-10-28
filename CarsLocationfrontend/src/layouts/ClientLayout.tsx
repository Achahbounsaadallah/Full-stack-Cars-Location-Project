import { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../features/auth/hooks/useAuth'
import LanguageSwitcher from '../shared/components/LanguageSwitcher'
import Logo from '../shared/components/Logo'
import ClientProfileModal from '../shared/components/ClientProfileModal'
import ClientSupportModal from '../shared/components/ClientSupportModal'
import {
  ArrowRight,
  LogOut,
  Menu,
  X,
  Briefcase,
  Car,
  CalendarCheck,
  Headphones,
  User,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Plus,
} from 'lucide-react'

export default function ClientLayout() {
  const { t } = useTranslation('common')
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Public visitor marketing links (shown ONLY when user is NOT logged in)
  const publicNavLinks = [
    { label: t('nav.solutions'), href: '/#solutions' },
    { label: t('nav.fleet'), href: '/#fleet' },
    { label: t('nav.workflow'), href: '/#workflow' },
    { label: t('nav.advantages'), href: '/#advantages' },
    { label: t('nav.faq'), href: '/#faq' },
  ]

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAnchorClick = (href: string) => {
    setMobileMenuOpen(false)
    if (href.startsWith('/#')) {
      if (location.pathname === '/') {
        const targetId = href.replace('/#', '')
        const elem = document.getElementById(targetId)
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        navigate(href)
      }
    }
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : 'U'
  const userName = user?.email ? user.email.split('@')[0] : ''

  const isBookingsActive = location.pathname.startsWith('/client/bookings')
  const isFleetActive = location.pathname === '/' || location.pathname.startsWith('/cars')

  return (
    <div className="client-app-shell">
      {/* Enterprise Fixed Navbar */}
      <header className="enterprise-navbar">
        <div className="navbar-container">
          {/* 1. Left Section: Brand Logo + Client Badge if logged in */}
          <div className="navbar-left flex items-center gap-3">
            <Link to="/" className="navbar-brand-link" aria-label="Nova Drive Home">
              <Logo height={38} />
            </Link>

            {user && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                <Sparkles size={11} className="text-amber-500" />
                <span>{t('clientPortal.badge')}</span>
              </span>
            )}
          </div>

          {/* 2. Middle Section: Conditional Navigation */}
          {user ? (
            /* ================= AUTHENTICATED CLIENT PORTAL NAV ================= */
            <nav className="navbar-middle flex items-center justify-center gap-1 sm:gap-2" aria-label="Client Navigation">
              {/* Fleet Catalogue Link */}
              <Link
                to="/#fleet"
                onClick={() => {
                  if (location.pathname === '/') {
                    const fleet = document.getElementById('fleet')
                    if (fleet) fleet.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isFleetActive
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Car size={15} />
                <span>{t('clientPortal.fleet')}</span>
              </Link>

              {/* My Bookings Link */}
              <Link
                to="/client/bookings"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isBookingsActive
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-900/30'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <CalendarCheck size={15} />
                <span>{t('clientPortal.myBookings')}</span>
              </Link>

              {/* Priority Support Trigger */}
              <button
                type="button"
                onClick={() => setSupportModalOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Headphones size={15} />
                <span>{t('clientPortal.support')}</span>
              </button>
            </nav>
          ) : (
            /* ================= PUBLIC VISITOR NAV ================= */
            <nav className="navbar-middle" aria-label="Main Navigation">
              {publicNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="navbar-link"
                  onClick={(e) => {
                    if (location.pathname === '/' && link.href.startsWith('/#')) {
                      e.preventDefault()
                      handleAnchorClick(link.href)
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          {/* 3. Right Actions */}
          <div className="navbar-right flex items-center gap-3">
            {/* Quick "New Booking" CTA for logged-in user */}
            {user && (
              <a
                href="/#fleet"
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault()
                    const fleet = document.getElementById('fleet')
                    if (fleet) fleet.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <Plus size={13} />
                <span>{t('clientPortal.newBooking')}</span>
              </a>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Authenticated User Profile Pill & Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-2.5 rtl:pr-1.5 rtl:pl-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100/80 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700/80 transition-all cursor-pointer group"
                  aria-expanded={userDropdownOpen}
                >
                  {/* Avatar Circle */}
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {userInitial}
                  </div>

                  {/* User Email */}
                  <div className="hidden sm:block text-left rtl:text-right">
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-100 max-w-[120px] truncate leading-tight">
                      {userName}
                    </p>
                  </div>

                  <ChevronDown
                    size={13}
                    className={`text-stone-400 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {/* Floating Profile Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Identity Header */}
                    <div className="px-3 py-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl mb-1.5 border border-stone-100 dark:border-stone-800">
                      <p className="text-xs font-extrabold text-stone-900 dark:text-stone-100 truncate">
                        {user.email}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <ShieldCheck size={11} />
                        <span>{t('clientPortal.accountStatus')}</span>
                      </span>
                    </div>

                    {/* Actions List */}
                    <div className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          setProfileModalOpen(true)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer text-left rtl:text-right"
                      >
                        <User size={15} className="text-amber-500" />
                        <span>{t('clientPortal.profile')}</span>
                      </button>

                      <Link
                        to="/client/bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors text-left rtl:text-right"
                      >
                        <CalendarCheck size={15} className="text-amber-500" />
                        <span>{t('clientPortal.myBookings')}</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false)
                          setSupportModalOpen(true)
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer text-left rtl:text-right"
                      >
                        <Headphones size={15} className="text-amber-500" />
                        <span>{t('clientPortal.support')}</span>
                      </button>

                      {/* Staff/Admin Portals if applicable */}
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-colors"
                        >
                          <Briefcase size={15} />
                          <span>Console Admin</span>
                        </Link>
                      )}
                      {user.role === 'EMPLOYEE' && (
                        <Link
                          to="/employee"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors"
                        >
                          <Briefcase size={15} />
                          <span>Espace Employé</span>
                        </Link>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-[1px] bg-stone-100 dark:bg-stone-800 my-1" />

                    {/* Sign Out Action */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        signOut()
                        navigate('/')
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer text-left rtl:text-right"
                    >
                      <LogOut size={15} />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Visitor Login & Register Buttons */
              <div className="navbar-auth-buttons">
                <Link to="/login" className="navbar-btn navbar-btn-login">
                  {t('login')}
                </Link>
                <Link to="/register" className="navbar-btn navbar-btn-signup">
                  <span>{t('register')}</span>
                  <ArrowRight size={13} className="rtl:rotate-180" />
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            {user ? (
              /* Mobile Menu for Authenticated User */
              <div className="mobile-links space-y-2">
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl mb-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                    {userInitial}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{user.email}</p>
                    <span className="text-[10px] text-amber-600 font-semibold">{t('clientPortal.badge')}</span>
                  </div>
                </div>

                <Link
                  to="/#fleet"
                  className="mobile-link flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Car size={16} />
                  <span>{t('clientPortal.fleet')}</span>
                </Link>

                <Link
                  to="/client/bookings"
                  className="mobile-link flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CalendarCheck size={16} />
                  <span>{t('clientPortal.myBookings')}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setProfileModalOpen(true)
                  }}
                  className="mobile-link flex items-center gap-2 w-full text-left cursor-pointer"
                >
                  <User size={16} />
                  <span>{t('clientPortal.profile')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    setSupportModalOpen(true)
                  }}
                  className="mobile-link flex items-center gap-2 w-full text-left cursor-pointer"
                >
                  <Headphones size={16} />
                  <span>{t('clientPortal.support')}</span>
                </button>

                <button
                  className="mobile-logout-btn flex items-center gap-2 w-full mt-3"
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                    navigate('/')
                  }}
                >
                  <LogOut size={16} />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              /* Mobile Menu for Visitor */
              <>
                <div className="mobile-links">
                  {publicNavLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="mobile-link"
                      onClick={(e) => {
                        if (location.pathname === '/' && link.href.startsWith('/#')) {
                          e.preventDefault()
                          handleAnchorClick(link.href)
                        } else {
                          setMobileMenuOpen(false)
                        }
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <div className="mobile-auth">
                  <div className="mobile-auth-grid">
                    <Link
                      to="/login"
                      className="navbar-btn navbar-btn-login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('login')}
                    </Link>
                    <Link
                      to="/register"
                      className="navbar-btn navbar-btn-signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('register')}
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Main Outlet with fixed header compensation */}
      <main className="client-content-area">
        <Outlet />
      </main>

      {/* User Profile Modal */}
      <ClientProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Priority Support Modal */}
      <ClientSupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
    </div>
  )
}
