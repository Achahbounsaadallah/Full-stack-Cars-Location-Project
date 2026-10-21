import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wrench, Calendar, Coins, AlertCircle, Car } from 'lucide-react'

import type { Maintenance } from '../../../types'
import Loader from '../../../shared/components/Loader'
import { getMaintenances } from '../services/maintenanceService'
import { statusLabel } from '../../../shared/utils/statusLabel'

export default function MaintenancePage() {
  const { t } = useTranslation('common')
  const [items, setItems] = useState<Maintenance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMaintenances()
      .then(setItems)
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }, [t])

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader label={t('loading')} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {t('admin')}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            {t('maintenance')}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {items.length} {t('maintenance').toLowerCase()}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-start">
                <th className="py-3 px-5 text-start">{t('vehicle')}</th>
                <th className="py-3 px-5 text-start">{t('description')}</th>
                <th className="py-3 px-5 text-start">{t('dates')}</th>
                <th className="py-3 px-5 text-start">{t('status')}</th>
                <th className="py-3 px-5 text-start">{t('cost')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                >
                  {/* Vehicle */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Car size={15} />
                      </div>
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {item.car ? `${item.car.brand} ${item.car.model}` : t('vehicle')}
                      </span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-4 px-5 text-stone-600 dark:text-stone-400 font-medium max-w-xs truncate">
                    {item.description || '-'}
                  </td>

                  {/* Dates */}
                  <td className="py-4 px-5 text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-stone-400 shrink-0" />
                      <span>
                        {new Date(item.startDate).toLocaleDateString()} →{' '}
                        {item.endDate ? new Date(item.endDate).toLocaleDateString() : '-'}
                      </span>
                    </div>
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      <span>{statusLabel(t, item.status)}</span>
                    </span>
                  </td>

                  {/* Cost */}
                  <td className="py-4 px-5 font-bold text-stone-900 dark:text-stone-100">
                    {item.cost ?? 0} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!items.length && (
          <div className="py-16 text-center text-sm text-stone-500 dark:text-stone-400">
            {t('noMaintenance')}
          </div>
        )}
      </div>
    </div>
  )
}
