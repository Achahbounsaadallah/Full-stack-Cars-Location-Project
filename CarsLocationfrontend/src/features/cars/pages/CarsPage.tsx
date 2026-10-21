import { useState, useMemo, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCars } from '../hooks/useCars'
import CarCard from '../components/CarCard'
import CarQuickViewModal from '../components/CarQuickViewModal'
import Loader from '../../../shared/components/Loader'
import type { Car, Search } from '../../../types'
import { categoryLabel, vehicleLabel } from '../../../shared/utils/catalogueLabels'
import {
  ShieldCheck,
  Cpu,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Users,
  KeyRound,
  BarChart3,
  Search as SearchIcon,
  MapPin,
  Calendar,
  Layers,
  PhoneCall,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  Zap,
  X,
  Gauge,
  Fuel,
  SlidersHorizontal,
  Eye,
  Star,
} from 'lucide-react'

// Curated Unsplash luxury vehicle backgrounds matching the platform's warm sand/charcoal/terracotta palette
const HERO_CAR_PRESETS = [
  {
    id: 'audi-rs',
    title: 'Audi Performance (Bronze Accents)',
    url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 'porsche-panamera',
    title: 'Porsche Executive (Dusk Highway)',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 'mercedes-amg',
    title: 'Mercedes-AMG GT (Warm Sunlight)',
    url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=2400&q=85',
  },
  {
    id: 'porsche-swiss',
    title: 'Porsche GT3 (Alpine Chalk Horizon)',
    url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2400&q=85',
  },
]

export default function CarsPage() {
  const { t } = useTranslation('common')
  const { cars, categories, loading, error, search } = useCars()
  const [filter, setFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [transmissionFilter, setTransmissionFilter] = useState('ALL')
  const [fuelFilter, setFuelFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'seats'>('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [quickViewCar, setQuickViewCar] = useState<Car | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [dates, setDates] = useState<Search>({ pickupDate: '', returnDate: '' })
  const [pickupCity, setPickupCity] = useState('Paris Hub Central')
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [heroBgUrl, setHeroBgUrl] = useState(HERO_CAR_PRESETS[0].url)

  const toggleFavorite = (carId: string) => {
    setFavorites((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    )
  }

  const resetAllFilters = () => {
    setFilter('')
    setSearchQuery('')
    setTransmissionFilter('ALL')
    setFuelFilter('ALL')
    setSortBy('featured')
  }

  const hasActiveFilters = Boolean(
    filter || searchQuery || transmissionFilter !== 'ALL' || fuelFilter !== 'ALL' || sortBy !== 'featured'
  )

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    cars.forEach((car) => {
      const name = car.category?.name
      if (name) {
        counts[name] = (counts[name] || 0) + 1
      }
    })
    return counts
  }, [cars])

  const visibleCars = useMemo(() => {
    return cars
      .filter((car) => {
        if (filter && car.category?.name !== filter) return false
        if (transmissionFilter !== 'ALL' && car.transmission?.toUpperCase() !== transmissionFilter) return false
        if (fuelFilter !== 'ALL') {
          const fuel = (car.fuelType || '').toUpperCase()
          if (fuelFilter === 'ELECTRIC' && !fuel.includes('ELECTRIC') && !fuel.includes('ÉLECTRIQUE')) return false
          if (fuelFilter === 'HYBRID' && !fuel.includes('HYBRID')) return false
          if (fuelFilter === 'PETROL' && !fuel.includes('PETROL') && !fuel.includes('ESSENCE')) return false
          if (fuelFilter === 'DIESEL' && !fuel.includes('DIESEL')) return false
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const match =
            car.brand.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q) ||
            (car.category?.name || '').toLowerCase().includes(q) ||
            (car.fuelType || '').toLowerCase().includes(q)
          if (!match) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.dailyBasePrice - b.dailyBasePrice
        if (sortBy === 'price-desc') return b.dailyBasePrice - a.dailyBasePrice
        if (sortBy === 'seats') return b.seats - a.seats
        return 0
      })
  }, [cars, filter, transmissionFilter, fuelFilter, searchQuery, sortBy])

  const spotlightCar = useMemo(() => {
    if (!cars.length) return null
    const candidate = cars.find((c) => {
      const name = `${c.brand} ${c.model}`.toLowerCase()
      return name.includes('porsche') || name.includes('amg') || name.includes('audi') || name.includes('taycan')
    })
    return candidate || cars[0]
  }, [cars])

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    if (dates.pickupDate && dates.returnDate) {
      search(dates)
      const fleetEl = document.getElementById('fleet')
      if (fleetEl) fleetEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const rawFaqItems = t('faqItems', { returnObjects: true })
  const faqItems: Array<{ q: string; a: string }> = Array.isArray(rawFaqItems)
    ? (rawFaqItems as Array<{ q: string; a: string }>)
    : []

  return (
    <div className="enterprise-landing-wrapper">
      {/* 1. ENTERPRISE HERO SECTION */}
      <section className="enterprise-hero-section">
        {/* Full Background Car Backdrop from Unsplash */}
        <div className="hero-background-backdrop" aria-hidden="true">
          <img
            src={heroBgUrl}
            alt=""
            className="hero-background-image"
            loading="eager"
            fetchPriority="high"
          />
          <div className="hero-background-overlay" />
          <div className="hero-ambient-glow" />
        </div>

        <div className="hero-inner-container">
          {/* Eyebrow Badge */}
          <div className="hero-pill-badge">
            <ShieldCheck size={14} className="hero-badge-icon" />
            <span>{t('landing.heroBadge')}</span>
          </div>

          {/* Centered Headline */}
          <h1 className="hero-main-heading">
            {t('heroTitle')} <br />
            <span className="heading-accent-text">{t('heroTitleEmphasis')}</span>
          </h1>

          {/* Centered Descriptive Paragraph */}
          <p className="hero-lead-paragraph">
            {t('landing.heroLead')}
          </p>

          {/* Centered Two CTAs */}
          <div className="hero-cta-group">
            <a href="#fleet" className="btn-b2b btn-b2b-primary">
              <span>{t('landing.exploreFleet')}</span>
              <ArrowRight size={16} className="rtl:rotate-180" />
            </a>
            <Link to="/register" className="btn-b2b btn-b2b-secondary">
              <Building2 size={16} />
              <span>{t('landing.openAccount')}</span>
            </Link>
          </div>

          {/* Trust Highlights Checklist */}
          <div className="hero-trust-bullets">
            <div className="trust-bullet-item">
              <CheckCircle2 size={15} className="trust-check-icon" />
              <span>{t('landing.trustInvoicing')}</span>
            </div>
            <div className="trust-bullet-item">
              <CheckCircle2 size={15} className="trust-check-icon" />
              <span>{t('landing.trustInsurance')}</span>
            </div>
            <div className="trust-bullet-item">
              <CheckCircle2 size={15} className="trust-check-icon" />
              <span>{t('landing.trustReplacement')}</span>
            </div>
          </div>

          {/* Enterprise Search & Booking Console */}
          <div className="hero-search-wrapper">
            <form className="enterprise-search-console" onSubmit={submitSearch}>
              <div className="search-field-group">
                <label className="search-field-label">
                  <MapPin size={13} />
                  <span>{t('landing.departureHub')}</span>
                </label>
                <select
                  className="search-select-input"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                >
                  <option value="Paris Hub Central">Paris • Hub Opéra & La Défense</option>
                  <option value="Paris CDG Airport">Paris • CDG Terminal Pro</option>
                  <option value="Lyon Part-Dieu">Lyon • Gare Part-Dieu</option>
                  <option value="Marseille St-Charles">Marseille • Hub Euroméditerranée</option>
                  <option value="Bruxelles Midi">Bruxelles • Hub International</option>
                </select>
              </div>

              <div className="search-field-group">
                <label className="search-field-label">
                  <Calendar size={13} />
                  <span>{t('landing.pickupDateTime')}</span>
                </label>
                <input
                  type="datetime-local"
                  className="search-datetime-input"
                  value={dates.pickupDate}
                  onChange={(e) => setDates({ ...dates, pickupDate: e.target.value })}
                  required
                />
              </div>

              <div className="search-field-group">
                <label className="search-field-label">
                  <Calendar size={13} />
                  <span>{t('landing.returnDateTime')}</span>
                </label>
                <input
                  type="datetime-local"
                  className="search-datetime-input"
                  value={dates.returnDate}
                  onChange={(e) => setDates({ ...dates, returnDate: e.target.value })}
                  required
                />
              </div>

              <div className="search-action-group">
                <button type="submit" className="search-submit-button">
                  <SearchIcon size={15} />
                  <span>{t('landing.searchSubmit')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Luxury Theme Visual Selector / Preset Switcher */}
          <div className="hero-visual-presets" aria-label="Hero background preset selector">
            <span className="visual-preset-caption">
              {t('landing.backdropPreset')}
            </span>
            <div className="visual-preset-buttons">
              {HERO_CAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`visual-preset-pill ${heroBgUrl === preset.url ? 'active' : ''}`}
                  onClick={() => setHeroBgUrl(preset.url)}
                  title={preset.title}
                >
                  <span className="preset-dot" />
                  <span>{preset.title.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORPORATE TRUST & CLIENT LOGOS BAR */}
      <section className="enterprise-trust-bar">
        <div className="trust-bar-container">
          <p className="trust-bar-caption">
            {t('landing.trustCaption')}
          </p>
          <div className="trust-logos-grid">
            <div className="corporate-logo-item">
              <span className="corp-logo-symbol">NEXUS</span>
              <span className="corp-logo-tag">CAPITAL</span>
            </div>
            <div className="corporate-logo-item">
              <span className="corp-logo-symbol">MERIDIAN</span>
              <span className="corp-logo-tag">GLOBAL LOGISTICS</span>
            </div>
            <div className="corporate-logo-item">
              <span className="corp-logo-symbol">VERTEX</span>
              <span className="corp-logo-tag">TECHNOLOGIES</span>
            </div>
            <div className="corporate-logo-item">
              <span className="corp-logo-symbol">AEROFLIGHT</span>
              <span className="corp-logo-tag">SYSTEMS</span>
            </div>
            <div className="corporate-logo-item">
              <span className="corp-logo-symbol">SOLARI</span>
              <span className="corp-logo-tag">MOBILITY</span>
            </div>
            <div className="corporate-logo-item">
              <span className="corp-logo-symbol">KINETIC</span>
              <span className="corp-logo-tag">ENERGY</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE ENTERPRISE VALUE PILLARS (SOLUTIONS) */}
      <section id="solutions" className="enterprise-pillars-section">
        <div className="section-header-block">
          <span className="section-eyebrow">
            {t('landing.solutionsEyebrow')}
          </span>
          <h2 className="section-heading">
            {t('landing.solutionsTitle')}
          </h2>
          <p className="section-subtitle">
            {t('landing.solutionsSubtitle')}
          </p>
        </div>

        <div className="pillars-grid">
          {/* Card 1: Compliance & Insurance */}
          <div className="pillar-card">
            <div className="pillar-icon-box">
              <ShieldCheck size={22} className="pillar-icon" />
            </div>
            <h3 className="pillar-title">
              {t('landing.pillar1Title')}
            </h3>
            <p className="pillar-description">
              {t('landing.pillar1Desc')}
            </p>
          </div>

          {/* Card 2: Connected Telematics */}
          <div className="pillar-card">
            <div className="pillar-icon-box">
              <Cpu size={22} className="pillar-icon" />
            </div>
            <h3 className="pillar-title">
              {t('landing.pillar2Title')}
            </h3>
            <p className="pillar-description">
              {t('landing.pillar2Desc')}
            </p>
          </div>

          {/* Card 3: Consolidated Billing */}
          <div className="pillar-card">
            <div className="pillar-icon-box">
              <FileSpreadsheet size={22} className="pillar-icon" />
            </div>
            <h3 className="pillar-title">
              {t('landing.pillar3Title')}
            </h3>
            <p className="pillar-description">
              {t('landing.pillar3Desc')}
            </p>
          </div>

          {/* Card 4: SLA Replacement */}
          <div className="pillar-card">
            <div className="pillar-icon-box">
              <Clock size={22} className="pillar-icon" />
            </div>
            <h3 className="pillar-title">
              {t('landing.pillar4Title')}
            </h3>
            <p className="pillar-description">
              {t('landing.pillar4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. LIVE FLEET CATALOG SECTION - FIGMA-INSPIRED EXECUTIVE ZONE */}
      <section id="fleet" className="enterprise-fleet-section py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header with Live Metrics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-3">
              <Sparkles size={13} />
              <span>{t('selection')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-stone-100">
              {t('landing.fleetSectionTitle')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl mt-2">
              {t('landing.fleetSectionSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('catalogueExtra.resultsFound', { count: visibleCars.length })}</span>
            </span>
          </div>
        </div>

        {/* ================= CREATIVE SPOTLIGHT HERO VEHICLE ================= */}
        {spotlightCar && !searchQuery && !filter && (
          <div className="relative mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white border border-stone-800/80 shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-8 lg:p-10">
              {/* Left Info Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-500 text-stone-950 flex items-center gap-1.5 shadow-sm">
                    <Star size={12} className="fill-current" />
                    <span>{t('catalogueExtra.spotlightBadge')}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-800/80 text-amber-400 border border-amber-500/30">
                    {categoryLabel(t, spotlightCar.category?.name)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{t('available')}</span>
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold tracking-widest uppercase text-amber-400/90">
                    {spotlightCar.brand}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
                    {spotlightCar.model}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-xl leading-relaxed">
                    {t('catalogueExtra.spotlightSubtitle')}
                  </p>
                </div>

                {/* Performance Specs Badges */}
                <div className="grid grid-cols-3 gap-3 max-w-md pt-2">
                  <div className="p-3 rounded-2xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-md">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('seats')}</span>
                    <span className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5 mt-0.5">
                      <Users size={14} className="text-amber-400" />
                      <span>{spotlightCar.seats} places</span>
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-md">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('catalogueExtra.transmission')}</span>
                    <span className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5 mt-0.5 truncate">
                      <Gauge size={14} className="text-amber-400 shrink-0" />
                      <span className="truncate">{vehicleLabel(t, spotlightCar.transmission)}</span>
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-md">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">{t('catalogueExtra.fuel')}</span>
                    <span className="text-sm font-extrabold text-stone-100 flex items-center gap-1.5 mt-0.5 truncate">
                      <Zap size={14} className="text-emerald-400 shrink-0" />
                      <span className="truncate">{vehicleLabel(t, spotlightCar.fuelType)}</span>
                    </span>
                  </div>
                </div>

                {/* CTAs & Price */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">
                      {t('catalogueExtra.dailyBaseRate')}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-amber-400">
                        {spotlightCar.dailyBasePrice} €
                      </span>
                      <span className="text-xs text-stone-300 font-semibold">/ {t('perDay')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 ml-auto rtl:ml-0 rtl:mr-auto">
                    <button
                      type="button"
                      onClick={() => setQuickViewCar(spotlightCar)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>{t('catalogueExtra.quickView')}</span>
                    </button>
                    <Link
                      to={`/cars/${spotlightCar.id}`}
                      className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/40 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{t('catalogueExtra.exploreSpotlight')}</span>
                      <ArrowRight size={14} className="rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Showcase Photo */}
              <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[260px] rounded-2xl overflow-hidden shadow-inner border border-stone-800">
                <img
                  src={carImageFallback(spotlightCar.brand, spotlightCar.model)}
                  alt={`${spotlightCar.brand} ${spotlightCar.model}`}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/20" />
                <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-stone-300 bg-stone-950/80 px-2.5 py-1 rounded-md border border-stone-700/60 backdrop-blur-md">
                    {t('catalogueExtra.instantBooking')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= COMMAND & FILTER CONTROL CENTER ================= */}
        <div className="bg-white dark:bg-stone-900/90 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs mb-8 space-y-4">
          {/* Row 1: Real-time Search + View Mode Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input with Clear Button */}
            <div className="relative flex-1 max-w-md">
              <SearchIcon
                size={16}
                className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('catalogueExtra.searchPlaceholder')}
                className="w-full pl-10 pr-9 rtl:pl-9 rtl:pr-10 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs font-semibold placeholder:text-stone-400 border border-stone-200 dark:border-stone-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/80">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title={t('catalogueExtra.viewGrid')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <LayoutGrid size={15} />
                  <span className="hidden sm:inline">{t('catalogueExtra.viewGrid')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  title={t('catalogueExtra.viewList')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <List size={15} />
                  <span className="hidden sm:inline">{t('catalogueExtra.viewList')}</span>
                </button>
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>{t('catalogueExtra.resetFilters')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category Filter Tabs with Count Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setFilter('')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                !filter
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700/60'
              }`}
            >
              <span>{t('all')}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                !filter ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-300'
              }`}>
                {cars.length}
              </span>
            </button>

            {categories.map((category) => {
              const active = filter === category.name
              const count = categoryCounts[category.name] || 0
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFilter(category.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-900/30'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700/60'
                  }`}
                >
                  <span>{categoryLabel(t, category.name)}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active ? 'bg-white text-amber-700 font-black' : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-300'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Row 3: Secondary Micro-filters (Transmission, Fuel, Sort) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Transmission filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('catalogueExtra.transmission')}:</span>
                <select
                  value={transmissionFilter}
                  onChange={(e) => setTransmissionFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 focus:outline-none"
                >
                  <option value="ALL">{t('catalogueExtra.allTransmissions')}</option>
                  <option value="AUTOMATIC">{t('vehicleValues.AUTOMATIC')}</option>
                  <option value="MANUAL">{t('vehicleValues.MANUAL')}</option>
                </select>
              </div>

              {/* Fuel filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('catalogueExtra.fuel')}:</span>
                <select
                  value={fuelFilter}
                  onChange={(e) => setFuelFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 focus:outline-none"
                >
                  <option value="ALL">{t('catalogueExtra.allFuels')}</option>
                  <option value="ELECTRIC">⚡ {t('vehicleValues.ELECTRIC')}</option>
                  <option value="HYBRID">{t('vehicleValues.HYBRID')}</option>
                  <option value="PETROL">{t('vehicleValues.PETROL')}</option>
                  <option value="DIESEL">{t('vehicleValues.DIESEL')}</option>
                </select>
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">{t('catalogueExtra.sortBy')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 focus:outline-none"
              >
                <option value="featured">{t('catalogueExtra.sortFeatured')}</option>
                <option value="price-asc">{t('catalogueExtra.sortPriceAsc')}</option>
                <option value="price-desc">{t('catalogueExtra.sortPriceDesc')}</option>
                <option value="seats">{t('catalogueExtra.sortSeats')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= CATALOGUE FLEET DISPLAY ================= */}
        {error ? (
          <div className="p-8 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-center">
            <p className="font-semibold">{error}</p>
          </div>
        ) : loading ? (
          <div className="py-20 flex justify-center">
            <Loader label={t('loading')} />
          </div>
        ) : visibleCars.length ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  viewMode="grid"
                  onQuickView={(c) => setQuickViewCar(c)}
                  isFavorite={favorites.includes(car.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  viewMode="list"
                  onQuickView={(c) => setQuickViewCar(c)}
                  isFavorite={favorites.includes(car.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )
        ) : (
          <div className="p-12 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <SearchIcon size={22} />
            </div>
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">{t('noResults')}</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Aucun véhicule ne correspond aux filtres actuels. Réinitialisez la recherche pour voir l'ensemble de la flotte.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
            >
              {t('catalogueExtra.resetFilters')}
            </button>
          </div>
        )}
      </section>

      {/* 5. 3-STEP ENTERPRISE WORKFLOW */}
      <section id="workflow" className="enterprise-workflow-section">
        <div className="section-header-block">
          <span className="section-eyebrow">
            {t('landing.workflowEyebrow')}
          </span>
          <h2 className="section-heading">
            {t('landing.workflowTitle')}
          </h2>
          <p className="section-subtitle">
            {t('landing.workflowSubtitle')}
          </p>
        </div>

        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="step-number-tag">01</div>
            <div className="step-icon-wrap">
              <Users size={24} className="step-icon" />
            </div>
            <h3 className="step-title">{t('landing.step1Title')}</h3>
            <p className="step-desc">{t('landing.step1Desc')}</p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number-tag">02</div>
            <div className="step-icon-wrap">
              <KeyRound size={24} className="step-icon" />
            </div>
            <h3 className="step-title">{t('landing.step2Title')}</h3>
            <p className="step-desc">{t('landing.step2Desc')}</p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number-tag">03</div>
            <div className="step-icon-wrap">
              <BarChart3 size={24} className="step-icon" />
            </div>
            <h3 className="step-title">{t('landing.step3Title')}</h3>
            <p className="step-desc">{t('landing.step3Desc')}</p>
          </div>
        </div>
      </section>

      {/* 6. B2B COMPARISON MATRIX: Traditional Rental vs Nova Drive Enterprise */}
      <section id="advantages" className="enterprise-comparison-section">
        <div className="section-header-block">
          <span className="section-eyebrow">
            {t('landing.comparisonEyebrow')}
          </span>
          <h2 className="section-heading">
            {t('landing.comparisonTitle')}
          </h2>
          <p className="section-subtitle">
            {t('landing.comparisonSubtitle')}
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-matrix-table">
            <thead>
              <tr>
                <th className="th-criteria">{t('landing.matrixCriteria')}</th>
                <th className="th-traditional">{t('landing.matrixTraditional')}</th>
                <th className="th-novadrive">{t('landing.matrixNova')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="td-criteria">{t('landing.row1Criteria')}</td>
                <td className="td-traditional">{t('landing.row1Trad')}</td>
                <td className="td-novadrive">
                  <span className="matrix-check">
                    <CheckCircle2 size={14} />
                    {t('landing.row1Nova')}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="td-criteria">{t('landing.row2Criteria')}</td>
                <td className="td-traditional">{t('landing.row2Trad')}</td>
                <td className="td-novadrive">
                  <span className="matrix-check">
                    <CheckCircle2 size={14} />
                    {t('landing.row2Nova')}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="td-criteria">{t('landing.row3Criteria')}</td>
                <td className="td-traditional">{t('landing.row3Trad')}</td>
                <td className="td-novadrive">
                  <span className="matrix-check">
                    <CheckCircle2 size={14} />
                    {t('landing.row3Nova')}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="td-criteria">{t('landing.row4Criteria')}</td>
                <td className="td-traditional">{t('landing.row4Trad')}</td>
                <td className="td-novadrive">
                  <span className="matrix-check">
                    <CheckCircle2 size={14} />
                    {t('landing.row4Nova')}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="td-criteria">{t('landing.row5Criteria')}</td>
                <td className="td-traditional">{t('landing.row5Trad')}</td>
                <td className="td-novadrive">
                  <span className="matrix-check">
                    <CheckCircle2 size={14} />
                    {t('landing.row5Nova')}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="td-criteria">{t('landing.row6Criteria')}</td>
                <td className="td-traditional">{t('landing.row6Trad')}</td>
                <td className="td-novadrive">
                  <span className="matrix-check">
                    <CheckCircle2 size={14} />
                    {t('landing.row6Nova')}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. ENTERPRISE FLEET IMPACT METRICS STRIP */}
      <section className="enterprise-stats-strip">
        <div className="stats-inner-container">
          <div className="stat-metric-card">
            <span className="stat-metric-number">{t('landing.stats.metric1')}</span>
            <span className="stat-metric-label">
              {t('landing.stats.metric1Label')}
            </span>
          </div>

          <div className="stat-metric-card">
            <span className="stat-metric-number">{t('landing.stats.metric2')}</span>
            <span className="stat-metric-label">
              {t('landing.stats.metric2Label')}
            </span>
          </div>

          <div className="stat-metric-card">
            <span className="stat-metric-number">{t('landing.stats.metric3')}</span>
            <span className="stat-metric-label">
              {t('landing.stats.metric3Label')}
            </span>
          </div>

          <div className="stat-metric-card">
            <span className="stat-metric-number">{t('landing.stats.metric4')}</span>
            <span className="stat-metric-label">
              {t('landing.stats.metric4Label')}
            </span>
          </div>
        </div>
      </section>

      {/* 8. CORPORATE TESTIMONIALS */}
      <section className="enterprise-testimonials-section">
        <div className="section-header-block">
          <span className="section-eyebrow">
            {t('landing.testimonials.eyebrow')}
          </span>
          <h2 className="section-heading">
            {t('landing.testimonials.title')}
          </h2>
          <p className="section-subtitle">
            {t('landing.testimonials.subtitle')}
          </p>
        </div>

        <div className="testimonials-grid">
          {/* Card 1 */}
          <div className="testimonial-card">
            <div className="testimonial-client-badge">
              <CheckCircle2 size={13} className="verified-icon" />
              <span>{t('landing.trustCaption')}</span>
            </div>
            <p className="testimonial-quote">
              {t('landing.testimonials.quote1')}
            </p>
            <div className="testimonial-author-block">
              <div className="author-avatar-initials">AD</div>
              <div className="author-details">
                <span className="author-name">{t('landing.testimonials.quote1Author')}</span>
                <span className="author-role">{t('landing.testimonials.quote1Role')}</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="testimonial-card">
            <div className="testimonial-client-badge">
              <CheckCircle2 size={13} className="verified-icon" />
              <span>{t('selection')}</span>
            </div>
            <p className="testimonial-quote">
              {t('landing.testimonials.quote2')}
            </p>
            <div className="testimonial-author-block">
              <div className="author-avatar-initials">CV</div>
              <div className="author-details">
                <span className="author-name">{t('landing.testimonials.quote2Author')}</span>
                <span className="author-role">{t('landing.testimonials.quote2Role')}</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="testimonial-card">
            <div className="testimonial-client-badge">
              <CheckCircle2 size={13} className="verified-icon" />
              <span>{t('landing.openAccount')}</span>
            </div>
            <p className="testimonial-quote">
              {t('landing.testimonials.quote3')}
            </p>
            <div className="testimonial-author-block">
              <div className="author-avatar-initials">TL</div>
              <div className="author-details">
                <span className="author-name">{t('landing.testimonials.quote3Author')}</span>
                <span className="author-role">{t('landing.testimonials.quote3Role')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ENTERPRISE FAQ SECTION */}
      <section id="faq" className="enterprise-faq-section">
        <div className="section-header-block">
          <span className="section-eyebrow">
            {t('landing.faqEyebrow')}
          </span>
          <h2 className="section-heading">
            {t('landing.faqTitle')}
          </h2>
          <p className="section-subtitle">
            {t('landing.faqSubtitle')}
          </p>
        </div>

        <div className="faq-container-list">
          {faqItems.map((item, idx) => {
            const isOpen = activeFaq === idx
            return (
              <div
                key={idx}
                className={`faq-accordion-item ${isOpen ? 'faq-item-expanded' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <span className="faq-toggle-icon">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer-content">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 10. HIGH-CONVERSION BOTTOM CTA BANNER */}
      <section className="enterprise-conversion-banner">
        <div className="conversion-banner-card">
          <div className="conversion-copy-block">
            <span className="conversion-eyebrow">
              {t('landing.ctaEyebrow')}
            </span>
            <h2 className="conversion-heading">
              {t('landing.ctaTitle')}
            </h2>
            <p className="conversion-description">
              {t('landing.ctaSubtitle')}
            </p>
          </div>

          <div className="conversion-action-block">
            <Link to="/register" className="btn-b2b btn-b2b-primary btn-b2b-lg">
              <span>{t('landing.ctaButton')}</span>
              <ArrowRight size={16} className="rtl:rotate-180" />
            </Link>
            <a href="#fleet" className="btn-b2b btn-b2b-outline btn-b2b-lg">
              <Layers size={16} />
              <span>{t('landing.ctaInventory')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 11. COMPREHENSIVE ENTERPRISE FOOTER */}
      <footer className="enterprise-site-footer">
        <div className="footer-top-grid">
          <div className="footer-brand-column">
            <div className="footer-brand-logo">
              <span className="footer-brand-title">{t('appName').toUpperCase()}</span>
              <span className="footer-brand-tag">ENTERPRISE MOBILITY</span>
            </div>
            <p className="footer-brand-text">
              {t('landing.footer.desc')}
            </p>
            <div className="footer-certifications-row">
              <span className="cert-badge">ISO 27001</span>
              <span className="cert-badge">RGPD Compliant</span>
              <span className="cert-badge">SOC 2 Type II</span>
            </div>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-col-title">{t('landing.footer.colFleet')}</h4>
            <ul className="footer-links-list">
              <li><a href="#fleet">{t('landing.footer.sedans')}</a></li>
              <li><a href="#fleet">{t('landing.footer.vans')}</a></li>
              <li><a href="#fleet">{t('landing.footer.electric')}</a></li>
              <li><a href="#solutions">{t('landing.footer.telematics')}</a></li>
              <li><a href="#advantages">{t('landing.footer.invoicing')}</a></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-col-title">{t('landing.footer.colCompany')}</h4>
            <ul className="footer-links-list">
              <li><a href="#workflow">{t('landing.footer.howItWorks')}</a></li>
              <li><a href="#advantages">{t('landing.footer.whyNova')}</a></li>
              <li><a href="#faq">{t('landing.footer.faq')}</a></li>
              <li><Link to="/login">{t('landing.footer.employeeLogin')}</Link></li>
              <li><Link to="/register">{t('landing.footer.openAccount')}</Link></li>
            </ul>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-col-title">{t('landing.footer.colSupport')}</h4>
            <div className="footer-contact-item">
              <PhoneCall size={14} className="contact-icon" />
              <span>{t('landing.footer.phone')}</span>
            </div>
            <p className="footer-hubs-caption">
              {t('landing.footer.hubs')}
            </p>
            <div className="footer-uptime-status">
              <span className="uptime-indicator-dot"></span>
              <span>{t('landing.footer.uptime')}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {t('landing.footer.copyright')}
          </p>
          <div className="footer-legal-links">
            <a href="#faq">{t('landing.footer.terms')}</a>
            <a href="#faq">{t('landing.footer.privacy')}</a>
            <a href="#faq">{t('landing.footer.legal')}</a>
          </div>
        </div>
      </footer>

      {/* Interactive Quick View Modal */}
      <CarQuickViewModal
        car={quickViewCar}
        onClose={() => setQuickViewCar(null)}
      />
    </div>
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
  return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85'
}
