import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CalendarCheck,
  Check,
  X,
  CreditCard,
  AlertCircle,
  Car,
  User,
  Clock,
} from 'lucide-react'

import type { Booking } from '../../../types'
import Loader from '../../../shared/components/Loader'
import { getAllBookings, updateBookingStatus } from '../services/bookingService'
import { statusLabel } from '../../../shared/utils/statusLabel'

export default function AdminBookingsPage() {
  const { t } = useTranslation('common')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllBookings()
      .then(setBookings)
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }, [t])

  const changeStatus = async (booking: Booking, action: 'approve' | 'reject' | 'confirm') => {
    try {
      const updated = await updateBookingStatus(booking.id, action)
      setBookings((items) => items.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setError(t('error'))
    }
  }

  const pending = bookings.filter(
    (booking) => booking.status === 'PENDING' || booking.status === 'WAITING_FOR_PAYMENT',
  )
  const reserved = bookings.filter((booking) => booking.status === 'CONFIRMED')

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader label={t('loading')} />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {t('admin')}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            {t('bookings')}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {bookings.length} {t('bookings').toLowerCase()}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* 1. Pending Bookings Table */}
      <BookingTable
        title={t('bookingConfirmation')}
        bookings={pending}
        action={changeStatus}
        t={t}
        empty={t('noPendingBookings')}
        isPending
      />

      {/* 2. Confirmed & Reserved Table */}
      <BookingTable
        title={t('reservedCars')}
        bookings={reserved}
        t={t}
        empty={t('noReservedCars')}
      />
    </div>
  )
}

function BookingTable({
  title,
  bookings,
  action,
  t,
  empty,
  isPending = false,
}: {
  title: string
  bookings: Booking[]
  action?: (booking: Booking, action: 'approve' | 'reject' | 'confirm') => void
  t: ReturnType<typeof useTranslation>['t']
  empty: string
  isPending?: boolean
}) {
  return (
    <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">{title}</h2>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isPending
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400'
                : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            {bookings.length}
          </span>
        </div>
      </div>

      {bookings.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-start">
                <th className="py-3 px-5 text-start">{t('bookingNumber')}</th>
                <th className="py-3 px-5 text-start">{t('vehicle')}</th>
                <th className="py-3 px-5 text-start">{t('clientLabel')}</th>
                <th className="py-3 px-5 text-start">{t('dates')}</th>
                <th className="py-3 px-5 text-start">{t('status')}</th>
                <th className="py-3 px-5 text-start">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                >
                  {/* Number */}
                  <td className="py-4 px-5">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700">
                      #{booking.bookingNumber}
                    </span>
                  </td>

                  {/* Vehicle */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Car size={15} />
                      </div>
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {booking.carBrandModel}
                      </span>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                      <User size={14} className="text-stone-400 shrink-0" />
                      <span className="text-xs truncate max-w-[180px]">{booking.clientEmail}</span>
                    </div>
                  </td>

                  {/* Dates */}
                  <td className="py-4 px-5 text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-stone-400 shrink-0" />
                      <span>
                        {new Date(booking.pickupDate).toLocaleDateString()} →{' '}
                        {new Date(booking.returnDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">
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
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      {action && booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => action(booking, 'approve')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                          >
                            <Check size={13} />
                            <span>{t('approve')}</span>
                          </button>
                          <button
                            onClick={() => action(booking, 'reject')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <X size={13} />
                            <span>{t('reject')}</span>
                          </button>
                        </>
                      )}

                      {action && booking.status === 'WAITING_FOR_PAYMENT' && (
                        <button
                          onClick={() => action(booking, 'confirm')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm cursor-pointer"
                        >
                          <CreditCard size={13} />
                          <span>{t('confirm')}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-sm text-stone-500 dark:text-stone-400">{empty}</div>
      )}
    </section>
  )
}
