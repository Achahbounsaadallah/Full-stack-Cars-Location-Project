import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Car } from '../../../types'
import { useTranslation } from 'react-i18next'
import { categoryLabel, vehicleLabel } from '../../../shared/utils/catalogueLabels'
import {
  Users,
  Fuel,
  Gauge,
  ArrowRight,
  Eye,
  Heart,
  ShieldCheck,
  Zap,
} from 'lucide-react'

const defaultCarImage =
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85'

interface CarCardProps {
  car: Car
  viewMode?: 'grid' | 'list'
  onQuickView?: (car: Car) => void
  isFavorite?: boolean
  onToggleFavorite?: (carId: string) => void
}

export default function CarCard({
  car,
  viewMode = 'grid',
  onQuickView,
  isFavorite: initialFavorite = false,
  onToggleFavorite,
}: CarCardProps) {
  const { t } = useTranslation('common')
  const [favorite, setFavorite] = useState(initialFavorite)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = !favorite
    setFavorite(next)
    if (onToggleFavorite) {
      onToggleFavorite(car.id)
    }
  }

  const isElectricOrHybrid =
    car.fuelType?.toUpperCase().includes('ELECTRIC') ||
    car.fuelType?.toUpperCase().includes('HYBRID') ||
    car.fuelType?.toUpperCase().includes('ÉLECTRIQUE')

  const isAvailable = car.status === 'AVAILABLE'
  const imageUrl = carImageFallback(car.brand, car.model)

  // ================= LIST VIEW LAYOUT =================
  if (viewMode === 'list') {
    return (
      <article className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col md:flex-row items-stretch">
        {/* Visual Thumbnail */}
        <div className="relative md:w-72 lg:w-80 h-52 md:h-auto overflow-hidden bg-stone-950 shrink-0">
          <img
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/20" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-xs">
              {categoryLabel(t, car.category?.name)}
            </span>
          </div>

          {/* Quick Heart Icon */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            aria-label="Save vehicle to favorites"
            className={`absolute top-3 right-3 rtl:right-auto rtl:left-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
              favorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-stone-900/60 text-stone-300 hover:text-white hover:bg-stone-900/90'
            }`}
          >
            <Heart size={14} className={favorite ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold tracking-widest text-amber-600 dark:text-amber-400 uppercase">
                  {car.brand}
                </span>
                <h3 className="text-xl font-black text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {car.model}
                </h3>
              </div>

              {/* Price Snippet */}
              <div className="sm:text-right">
                <div className="flex items-baseline sm:justify-end gap-1">
                  <span className="text-2xl font-black text-stone-900 dark:text-stone-100">
                    {car.dailyBasePrice} €
                  </span>
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {t('perDay')}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck size={12} />
                  <span>{t('catalogueExtra.fullInsurance')}</span>
                </span>
              </div>
            </div>

            {/* Spec Chips Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                <Users size={13} className="text-amber-600 dark:text-amber-400" />
                <span>{car.seats} {t('seats')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                <Gauge size={13} className="text-amber-600 dark:text-amber-400" />
                <span>{vehicleLabel(t, car.transmission)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                {isElectricOrHybrid ? (
                  <Zap size={13} className="text-emerald-500 animate-pulse" />
                ) : (
                  <Fuel size={13} className="text-amber-600 dark:text-amber-400" />
                )}
                <span>{vehicleLabel(t, car.fuelType)}</span>
              </span>
              {isAvailable && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>{t('available')}</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 pt-4 border-t border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-3">
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(car)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <Eye size={14} />
                <span>{t('catalogueExtra.quickView')}</span>
              </button>
            )}

            <Link
              to={`/cars/${car.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-900/20 transition-all duration-150 cursor-pointer ml-auto rtl:ml-0 rtl:mr-auto"
            >
              <span>{t('catalogueExtra.reserveNow')}</span>
              <ArrowRight size={14} className="rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // ================= MODERN FIGMA GRID CARD =================
  return (
    <article className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* 1. Visual Presentation Area */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-950 shrink-0">
        <img
          src={imageUrl}
          alt={`${car.brand} ${car.model}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30" />

        {/* Top Badges Row */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="pointer-events-auto px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-stone-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 shadow-xs">
            {categoryLabel(t, car.category?.name)}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {isAvailable && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold border border-emerald-500/30 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t('available')}</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label="Add to favorites"
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer ${
                favorite
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-stone-900/70 text-stone-300 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Heart size={14} className={favorite ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* Quick View Button on Image Hover */}
        {onQuickView && (
          <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={() => onQuickView(car)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-900 backdrop-blur-md text-white text-[11px] font-bold border border-stone-700/80 shadow-md cursor-pointer transition-transform group-hover:scale-100"
            >
              <Eye size={12} />
              <span>{t('catalogueExtra.quickView')}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Content & Information Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {car.brand}
              </span>
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1 mt-0.5">
                {car.model}
              </h3>
            </div>

            {/* Daily Price */}
            <div className="text-right shrink-0">
              <span className="block text-xl font-black text-stone-900 dark:text-stone-100">
                {car.dailyBasePrice} €
              </span>
              <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                {t('perDay')}
              </span>
            </div>
          </div>

          {/* Technical Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-stone-100 dark:border-stone-800/80 text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Users size={14} className="text-stone-400 shrink-0" />
              <span className="truncate">{car.seats} {t('seats')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Gauge size={14} className="text-stone-400 shrink-0" />
              <span className="truncate">{vehicleLabel(t, car.transmission)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {isElectricOrHybrid ? (
                <Zap size={14} className="text-emerald-500 shrink-0 animate-pulse" />
              ) : (
                <Fuel size={14} className="text-stone-400 shrink-0" />
              )}
              <span className="truncate">{vehicleLabel(t, car.fuelType)}</span>
            </div>
          </div>

          {/* Guarantee / Included Feature Callout */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
            <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{t('catalogueExtra.fullInsurance')}</span>
          </div>
        </div>

        {/* 3. Action Button Group */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/60 flex items-center gap-2">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(car)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 transition-colors"
              title={t('catalogueExtra.quickView')}
            >
              <Eye size={15} />
            </button>
          )}

          <Link
            to={`/cars/${car.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-stone-900 hover:bg-amber-600 dark:bg-stone-800 dark:hover:bg-amber-600 text-white shadow-xs hover:shadow-md transition-all duration-200 group/btn"
          >
            <span>{t('catalogueExtra.bookDirect')}</span>
            <ArrowRight
              size={13}
              className="rtl:rotate-180 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </article>
  )
}

function carImageFallback(brand: string, model: string): string {
  const name = `${brand} ${model}`.toLowerCase()
  if (name.includes('bmw') || name.includes('serie') || name.includes('m4')) {
    return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('mercedes') || name.includes('classe') || name.includes('amg')) {
    return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('audi') || name.includes('rs') || name.includes('a6') || name.includes('q7')) {
    return 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('tesla') || name.includes('model') || name.includes('plaid')) {
    return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('porsche') || name.includes('taycan') || name.includes('911') || name.includes('panamera')) {
    return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('peugeot') || name.includes('renault') || name.includes('volkswagen') || name.includes('golf')) {
    return 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=85'
  }
  if (name.includes('ferrari') || name.includes('lambo') || name.includes('mclaren')) {
    return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=85'
  }
  return defaultCarImage
}
