import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { getMyBookings } from '../../features/bookings/services/bookingService'
import {
  X,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  Key,
  Car,
  Clock,
  Sparkles,
  LogOut,
  Mail,
  Award,
  Crown,
} from 'lucide-react'

interface ClientProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ClientProfileModal({ isOpen, onClose }: ClientProfileModalProps) {
  const { t } = useTranslation('common')
  const { user, signOut } = useAuth()
  const [bookingCount, setBookingCount] = useState<number>(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // Fetch booking count to determine VIP status (> 5 bookings = VIP)
  useEffect(() => {
    if (isOpen && user) {
      getMyBookings()
        .then((bookings) => setBookingCount(bookings.length))
        .catch(() => setBookingCount(0))
    }
  }, [isOpen, user])

  if (!isOpen || !user) return null

  const userInitial = user.email ? user.email[0].toUpperCase() : 'U'
  const userName = user.email.split('@')[0]
  const isVip = bookingCount > 5
  const vipProgress = Math.min((bookingCount / 5) * 100, 100)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col text-stone-900 dark:text-stone-100 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div
          className={`relative p-6 text-white overflow-hidden border-b border-stone-800 ${
            isVip
              ? 'bg-gradient-to-r from-stone-900 via-amber-950 to-amber-900'
              : 'bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950'
          }`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          {isVip && (
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(245,158,11,0.08),transparent)] pointer-events-none" />
          )}

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('catalogueExtra.closeModal')}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-700/60"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            {/* Avatar */}
            <div
              className={`w-16 h-16 rounded-2xl text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0 ${
                isVip
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 ring-4 ring-amber-400/30 shadow-amber-900/50'
                  : 'bg-gradient-to-br from-amber-500 to-amber-700 ring-4 ring-amber-500/20 shadow-amber-900/40'
              }`}
            >
              {userInitial}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {t('clientPortal.accountStatus')}
                </span>
                {/* VIP Badge — only rendered when bookingCount > 5 */}
                {isVip && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-amber-900 bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-0.5 rounded-full shadow-sm">
                    <Crown size={11} />
                    Client VIP
                  </span>
                )}
              </div>
              <h2 id="profile-modal-title" className="text-xl font-black text-white mt-1 capitalize">
                {userName}
              </h2>
              <p className="text-xs text-stone-300 flex items-center gap-1.5 mt-0.5">
                <Mail size={13} className="text-stone-400" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">

          {/* VIP Card or Progress Toward VIP */}
          {isVip ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-300/60 dark:border-amber-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Crown size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                    Statut Entreprise
                  </span>
                  <p className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                    {t('clientPortal.profileTier')}
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                    {bookingCount} réservations complétées
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                <Crown size={11} />
                <span>VIP</span>
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                      Statut Entreprise
                    </span>
                    <p className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                      {t('clientPortal.profileTier')}
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-600 text-white shadow-xs">
                  <Sparkles size={11} />
                  <span>Actif</span>
                </span>
              </div>
              {/* Progress bar toward VIP */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Crown size={10} className="text-amber-500" />
                    Progression vers le statut VIP
                  </span>
                  <span className="text-amber-600 font-bold">{bookingCount} / 5 réservations</span>
                </div>
                <div className="h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-700"
                    style={{ width: `${vipProgress}%` }}
                  />
                </div>
                {bookingCount < 5 && (
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1.5">
                    Encore{' '}
                    <strong className="text-amber-600">
                      {5 - bookingCount} réservation{5 - bookingCount > 1 ? 's' : ''}
                    </strong>{' '}
                    pour débloquer le statut VIP
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Verification Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Accréditations & Garanties Actives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    Permis de conduire vérifié
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Validation KYC UE & Internationale
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-2.5">
                <Key size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    Clé Digitale Nova Pass
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Déverrouillage instantané sur smartphone
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    Assurance Tous Risques Pro
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Franchise 0€ & Dépannage prioritaire
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-2.5">
                <Clock size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    SLA Remplacement 60 min
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Livraison véhicule relais garantie
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              to="/client/bookings"
              onClick={onClose}
              className="p-3.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck size={15} className="text-amber-600 dark:text-amber-400" />
                <span>{t('clientPortal.myBookings')}</span>
              </span>
              <span className="text-stone-400">→</span>
            </Link>

            <Link
              to="/"
              onClick={onClose}
              className="p-3.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Car size={15} className="text-amber-600 dark:text-amber-400" />
                <span>{t('clientPortal.fleet')}</span>
              </span>
              <span className="text-stone-400">→</span>
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-stone-50 dark:bg-stone-950/40 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose()
              signOut()
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>{t('logout')}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 transition-colors cursor-pointer"
          >
            {t('catalogueExtra.closeModal')}
          </button>
        </div>
      </div>
    </div>
  )
}
