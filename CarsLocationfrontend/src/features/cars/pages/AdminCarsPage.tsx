import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Car as CarIcon,
  Filter,
  Trash2,
  AlertCircle,
  Plus,
} from 'lucide-react'

import type { Car } from '../../../types'
import Loader from '../../../shared/components/Loader'
import { deleteCar, getCars, updateCar } from '../services/carService'
import { statusLabel } from '../../../shared/utils/statusLabel'
import AddCarModal from '../components/AddCarModal'

export default function AdminCarsPage() {
  const { t } = useTranslation('common')
  const [cars, setCars] = useState<Car[]>([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)

  const loadCars = useCallback(() => {
    setLoading(true)
    getCars()
      .then(setCars)
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }, [t])

  useEffect(() => {
    loadCars()
  }, [loadCars])

  const visibleCars = useMemo(
    () => (filter === 'ALL' ? cars : cars.filter((car) => car.status === filter)),
    [cars, filter],
  )

  const changeStatus = async (car: Car, status: string) => {
    try {
      const updated = await updateCar(car.id, { ...car, categoryId: car.category?.id, status })
      setCars((items) => items.map((item) => (item.id === updated.id ? updated : item)))
    } catch {
      setError(t('error'))
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm(`${t('delete')} ?`)) return
    try {
      await deleteCar(id)
      setCars((items) => items.filter((car) => car.id !== id))
    } catch {
      setError(t('error'))
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader label={t('loading')} />
      </div>
    )
  }

  return (
    <>
    <AddCarModal
      isOpen={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onCarAdded={() => { setAddModalOpen(false); loadCars() }}
    />
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {t('admin')}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            {t('fleetManagement')}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t('fleetDescription')}</p>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-3">
          <button
            id="add-car-btn"
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', boxShadow: '0 4px 14px rgba(124,58,237,0.35)' }}
          >
            <Plus size={15} />
            Add Vehicle
          </button>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-stone-400" />
            <select
              className="h-10 px-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-semibold text-stone-700 dark:text-stone-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="ALL">{t('all')}</option>
              <option value="AVAILABLE">{statusLabel(t, 'AVAILABLE')}</option>
              <option value="RENTED">{statusLabel(t, 'RENTED')}</option>
              <option value="MAINTENANCE">{statusLabel(t, 'MAINTENANCE')}</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Data Table Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-start">
                <th className="py-3.5 px-5 text-start">{t('vehicle')}</th>
                <th className="py-3.5 px-5 text-start">{t('registration')}</th>
                <th className="py-3.5 px-5 text-start">{t('category')}</th>
                <th className="py-3.5 px-5 text-start">{t('price')}</th>
                <th className="py-3.5 px-5 text-start">{t('status')}</th>
                <th className="py-3.5 px-5 text-start">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
              {visibleCars.map((car) => (
                <tr
                  key={car.id}
                  className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                >
                  {/* Vehicle */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <CarIcon size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 dark:text-stone-100">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-xs text-stone-400">{car.productionYear}</p>
                      </div>
                    </div>
                  </td>

                  {/* Registration */}
                  <td className="py-4 px-5">
                    <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60">
                      {car.registrationNumber}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-5 text-stone-600 dark:text-stone-400 font-medium">
                    {car.category?.name || '-'}
                  </td>

                  {/* Price */}
                  <td className="py-4 px-5 font-bold text-stone-900 dark:text-stone-100">
                    {car.dailyBasePrice} € <span className="text-xs font-normal text-stone-500">{t('perDay')}</span>
                  </td>

                  {/* Status Pill */}
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        car.status === 'AVAILABLE'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : car.status === 'RENTED'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                          : car.status === 'MAINTENANCE'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                      <span>{statusLabel(t, car.status)}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <select
                        className="h-8 px-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-medium text-stone-700 dark:text-stone-200 shadow-sm focus:outline-none"
                        value={car.status}
                        onChange={(event) => changeStatus(car, event.target.value)}
                      >
                        <option value="AVAILABLE">{statusLabel(t, 'AVAILABLE')}</option>
                        <option value="RENTED">{statusLabel(t, 'RENTED')}</option>
                        <option value="MAINTENANCE">{statusLabel(t, 'MAINTENANCE')}</option>
                        <option value="CLEANING">{statusLabel(t, 'CLEANING')}</option>
                        <option value="OUT_OF_SERVICE">{statusLabel(t, 'OUT_OF_SERVICE')}</option>
                      </select>

                      <button
                        onClick={() => remove(car.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                        title={t('delete')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!visibleCars.length && (
          <div className="py-16 text-center text-sm text-stone-500 dark:text-stone-400">
            {t('noResults')}
          </div>
        )}
      </div>
    </div>
    </>
  )
}
