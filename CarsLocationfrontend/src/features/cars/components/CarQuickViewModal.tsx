import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Car } from '../../../types'
import { categoryLabel, vehicleLabel } from '../../../shared/utils/catalogueLabels'
import {
  X,
  Users,
  Gauge,
  Fuel,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Key,
} from 'lucide-react'

interface CarQuickViewModalProps {
  car: Car | null
  onClose: () => void
}

export default function CarQuickViewModal({ car, onClose }: CarQuickViewModalProps) {
  const { t } = useTranslation('common')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (car) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [car, onClose])

  if (!car) return null

  const isElectricOrHybrid =
    car.fuelType?.toUpperCase().includes('ELECTRIC') ||
    car.fuelType?.toUpperCase().includes('HYBRID') ||
    car.fuelType?.toUpperCase().includes('ÉLECTRIQUE')

  const imageUrl = carImageFallback(car.brand, car.model)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-car-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('catalogueExtra.closeModal')}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 w-9 h-9 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-200 hover:text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-stone-700/60"
        >
          <X size={18} />
        </button>

        {/* Visual Half */}
        <div className="relative md:w-5/12 h-64 md:h-auto bg-stone-950 overflow-hidden shrink-0">
          <img
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30" />

          {/* Category Chip */}
          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 backdrop-blur-md">
              {categoryLabel(t, car.category?.name)}
            </span>
          </div>

          {/* Status Chip */}
          <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 text-xs font-bold border border-emerald-500/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('available')}</span>
            </span>
          </div>
        </div>

        {/* Details & Specs Half */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header */}
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {car.brand}
              </span>
              <h2 id="modal-car-title" className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100 mt-1">
                {car.model}
              </h2>
            </div>

            {/* Price Box */}
            <div className="mt-4 p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200/90 dark:border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {t('catalogueExtra.dailyBaseRate')}
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-black text-stone-900 dark:text-stone-100">
                    {car.dailyBasePrice} €
                  </span>
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    / {t('perDay')}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles size={13} />
                <span>B2B Pro</span>
              </span>
            </div>

            {/* Spec Matrix Grid */}
            <div className="mt-5 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {t('catalogueExtra.vehicleSpecs')}
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">{t('seats')}</span>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{car.seats} places</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Gauge size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">{t('catalogueExtra.transmission')}</span>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{vehicleLabel(t, car.transmission)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    {isElectricOrHybrid ? <Zap size={16} className="text-emerald-500" /> : <Fuel size={16} />}
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">{t('catalogueExtra.fuel')}</span>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{vehicleLabel(t, car.fuelType)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Key size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Accès</span>
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">Clé Digitale</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Included Services Bullets */}
            <div className="mt-5 space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>{t('catalogueExtra.fullInsurance')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Assistance dépannage & véhicule relais sous 60 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Téléphonie Bluetooth, GPS Pro & Climatisation multi-zones</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              {t('catalogueExtra.closeModal')}
            </button>
            <Link
              to={`/cars/${car.id}`}
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30 transition-all duration-150 cursor-pointer"
            >
              <span>{t('catalogueExtra.reserveNow')}</span>
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function carImageFallback(brand: string, model: string): string {
  const name = `${brand} ${model}`.toLowerCase()
  if (name.includes('bmw') || name.includes('serie')) {
    return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('mercedes') || name.includes('classe')) {
    return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('audi') || name.includes('rs') || name.includes('a6') || name.includes('q7')) {
    return 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('tesla') || name.includes('model')) {
    return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('porsche') || name.includes('taycan') || name.includes('911')) {
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85'
  }
  return 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=85'
}
