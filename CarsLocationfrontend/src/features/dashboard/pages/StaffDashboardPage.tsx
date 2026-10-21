import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Car as CarIcon,
  CalendarCheck,
  CheckCircle2,
  Wrench,
  Clock,
  Check,
  X,
  CreditCard,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'

import { getCars } from '../../cars/services/carService'
import {
  getAllBookings,
  getPendingBookings,
  updateBookingStatus,
} from '../../bookings/services/bookingService'
import type { Booking, Car } from '../../../types'
import Loader from '../../../shared/components/Loader'
import { statusLabel } from '../../../shared/utils/statusLabel'

export default function StaffDashboardPage({ admin = false }: { admin?: boolean }) {
  const { t } = useTranslation('common')
  const [cars, setCars] = useState<Car[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    Promise.all([getCars(), admin ? getAllBookings() : getPendingBookings()])
      .then(([nextCars, nextBookings]) => {
        setCars(nextCars)
        setBookings(nextBookings)
      })
      .catch(() => setMessage(t('error')))
      .finally(() => setLoading(false))
  }, [admin, t])

  const changeStatus = async (booking: Booking, action: 'approve' | 'reject' | 'confirm') => {
    try {
      const updated = await updateBookingStatus(booking.id, action)
      setBookings((items) => items.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setMessage(t('error'))
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader label={t('loading')} />
      </div>
    )
  }

  const availableCarsCount = cars.filter((car) => car.status === 'AVAILABLE').length
  const rentedCarsCount = cars.filter((car) => car.status === 'RENTED').length
  const maintenanceCarsCount = cars.filter((car) => car.status === 'MAINTENANCE').length
  const outOfServiceCount = cars.filter((car) => car.status === 'OUT_OF_SERVICE').length
  const totalFleet = cars.length || 1

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {admin ? t('admin') : t('employee')}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            {t('dashboard')}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t('dashboardIntro')}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300/50 dark:border-stone-700">
            <Clock size={13} className="text-amber-600" />
            <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </span>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <p>{message}</p>
        </div>
      )}

      {/* Modern KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Fleet Card */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('cars')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <CarIcon size={19} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {cars.length}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>100% Total</span>
            </span>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('bookings')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <CalendarCheck size={19} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {bookings.length}
            </span>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {bookings.filter((b) => b.status === 'PENDING').length} {t('statuses.PENDING')}
            </span>
          </div>
        </div>

        {/* Available Cars Card */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('available')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={19} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {availableCarsCount}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {Math.round((availableCarsCount / totalFleet) * 100)}%
            </span>
          </div>
        </div>

        {/* Maintenance Cars Card */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              {t('maintenance')}
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center">
              <Wrench size={19} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
              {maintenanceCarsCount}
            </span>
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {Math.round((maintenanceCarsCount / totalFleet) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Bookings & Fleet Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Bookings (8 cols) */}
        <section className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {t('recentBookings')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {bookings.length} {t('bookings').toLowerCase()}
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              {bookings.slice(0, 5).length} / {bookings.length}
            </span>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {bookings.slice(0, 5).map((booking) => (
              <article
                key={booking.id}
                className="p-5 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/50 dark:border-amber-900/50">
                      #{booking.bookingNumber}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {booking.carBrandModel}
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {booking.clientEmail}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : booking.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        : booking.status === 'WAITING_FOR_PAYMENT'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {statusLabel(t, booking.status)}
                  </span>

                  {booking.status === 'PENDING' && (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => changeStatus(booking, 'approve')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                      >
                        <Check size={13} />
                        <span>{t('approve')}</span>
                      </button>
                      <button
                        onClick={() => changeStatus(booking, 'reject')}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <X size={13} />
                        <span>{t('reject')}</span>
                      </button>
                    </div>
                  )}

                  {booking.status === 'WAITING_FOR_PAYMENT' && (
                    <button
                      onClick={() => changeStatus(booking, 'confirm')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
                    >
                      <CreditCard size={13} />
                      <span>{t('confirm')}</span>
                    </button>
                  )}
                </div>
              </article>
            ))}

            {!bookings.length && (
              <div className="py-12 text-center text-sm text-stone-500 dark:text-stone-400">
                {t('noResults')}
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Fleet Health Distribution (4 cols) */}
        <section className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm p-6 space-y-5">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {t('fleetHealth')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {cars.length} {t('cars').toLowerCase()} {t('totalCars' as any) || ''}
            </p>
          </div>

          <div className="space-y-4">
            {/* Available */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>{t('available')}</span>
                </span>
                <span className="font-bold">{availableCarsCount}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(availableCarsCount / totalFleet) * 100}%` }}
                />
              </div>
            </div>

            {/* Rented */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>{statusLabel(t, 'RENTED')}</span>
                </span>
                <span className="font-bold">{rentedCarsCount}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(rentedCarsCount / totalFleet) * 100}%` }}
                />
              </div>
            </div>

            {/* Maintenance */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>{statusLabel(t, 'MAINTENANCE')}</span>
                </span>
                <span className="font-bold">{maintenanceCarsCount}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(maintenanceCarsCount / totalFleet) * 100}%` }}
                />
              </div>
            </div>

            {/* Out of Service */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>{statusLabel(t, 'OUT_OF_SERVICE')}</span>
                </span>
                <span className="font-bold">{outOfServiceCount}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${(outOfServiceCount / totalFleet) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
