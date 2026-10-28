import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Car } from '../../../types'
import { categoryLabel, vehicleLabel } from '../../../shared/utils/catalogueLabels'
import cihBankImg from '../../../assets/banks/cih_bank.jpg'
import attijariwafaImg from '../../../assets/banks/attijariwafa_bank.jpg'
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
  Calendar,
  Activity,
  Tag,
  MapPin,
  Star,
  Clock,
  CreditCard,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Phone,
  FileText,
  CalendarDays,
  Radio,
  SlidersHorizontal,
  Layers,
} from 'lucide-react'

interface CarQuickViewModalProps {
  car: Car | null
  onClose: () => void
}

interface CarAngle {
  id: string
  label: string
  url: string
}

/* ── Bank Accounts for Transfer RIB ─────────────────────────── */
const BANK_ACCOUNTS = [
  {
    id: 'cih',
    name: 'CIH Bank',
    logo: cihBankImg,
    rib: '230 780 4007678521001282 47',
    iban: 'MA64 2307 8040 0767 8521 0012 8247',
    swift: 'CIHBMAMC',
    accent: '#e05c1b',
  },
  {
    id: 'attijariwafa',
    name: 'Attijariwafa Bank',
    logo: attijariwafaImg,
    rib: '007 780 0011234567890123 45',
    iban: 'MA64 0077 8000 1123 4567 8901 2345',
    swift: 'BCMAMAMC',
    accent: '#d4821a',
  },
]

export default function CarQuickViewModal({ car, onClose }: CarQuickViewModalProps) {
  const { t } = useTranslation('common')
  const [selectedAngle, setSelectedAngle] = useState<number>(0)
  const [isFullView, setIsFullView] = useState<boolean>(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Quick reservation dates simulation
  const [pickupDate, setPickupDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  })
  const [returnDate, setReturnDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 4)
    return d.toISOString().slice(0, 10)
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (car) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
      setSelectedAngle(0)
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

  const angles: CarAngle[] = getCarAngles(car.brand, car.model)
  const currentImage = angles[selectedAngle]?.url || angles[0].url

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      /* ignore */
    }
  }

  // Calculate simulated days
  const days = Math.max(
    1,
    Math.round(
      (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 3600 * 24)
    ) || 3
  )
  const estimatedTotal = (car.dailyBasePrice || 0) * days

  // Technical specifications
  const specs = [
    {
      icon: <Users size={16} />,
      label: t('seats'),
      value: `${car.seats} places confort`,
      accent: 'amber',
    },
    {
      icon: <Gauge size={16} />,
      label: t('catalogueExtra.transmission'),
      value: vehicleLabel(t, car.transmission),
      accent: 'amber',
    },
    {
      icon: isElectricOrHybrid ? <Zap size={16} /> : <Fuel size={16} />,
      label: t('catalogueExtra.fuel'),
      value: vehicleLabel(t, car.fuelType),
      accent: isElectricOrHybrid ? 'emerald' : 'amber',
    },
    {
      icon: <Calendar size={16} />,
      label: 'Année modèle',
      value: car.productionYear ? `${car.productionYear}` : '2024',
      accent: 'amber',
    },
    {
      icon: <Activity size={16} />,
      label: 'Kilométrage',
      value: car.mileage ? `${car.mileage.toLocaleString('fr-FR')} km` : 'Certifié < 25 000 km',
      accent: 'amber',
    },
    {
      icon: <Key size={16} />,
      label: 'Accès & Démarrage',
      value: 'Clé Digitale 24/7 + Carte',
      accent: 'amber',
    },
    {
      icon: <Tag size={16} />,
      label: t('category'),
      value: categoryLabel(t, car.category?.name),
      accent: 'amber',
    },
    {
      icon: <Layers size={16} />,
      label: 'Capacité coffre',
      value: '480 L (3 valises + 2 sacs)',
      accent: 'amber',
    },
    {
      icon: <SlidersHorizontal size={16} />,
      label: 'Portes / Châssis',
      value: '5 portes / Berline Premium',
      accent: 'amber',
    },
    {
      icon: <Star size={16} />,
      label: 'Finition & Segment',
      value: 'Exécutif B2B Pro',
      accent: 'amber',
    },
  ]

  // Onboard equipment & technology
  const equipment = [
    { title: 'Navigation GPS Connectée 3D', desc: 'Info-trafic en direct et alertes zones de danger' },
    { title: 'Apple CarPlay & Android Auto', desc: 'Connexion sans fil haute fidélité' },
    { title: 'Caméra de recul HD & Radars 360°', desc: 'Aide au stationnement active avec trajectoire' },
    { title: 'Régulateur de vitesse adaptatif', desc: 'Maintien dans la voie et freinage autonome' },
    { title: 'Climatisation automatique tri-zone', desc: 'Purificateur d’air et filtres anti-allergènes' },
    { title: 'Projecteurs Full LED directionnels', desc: 'Phares adaptatifs automatiques grand faisceau' },
    { title: 'Système audio Surround Hi-Fi', desc: 'Son immersif 10 haut-parleurs' },
    { title: 'Accès mains libres Keyless-Go', desc: 'Déverrouillage automatique à l’approche' },
  ]

  // Rental conditions
  const rentalConditions = [
    {
      icon: <CreditCard size={15} className="text-amber-500" />,
      label: 'Caution / Dépôt de garantie',
      val: '5 000 MAD (~500 €) par pré-autorisation carte',
    },
    {
      icon: <FileText size={15} className="text-amber-500" />,
      label: 'Âge minimum & Permis',
      val: '21 ans révolus · Permis B valide depuis plus d’1 an',
    },
    {
      icon: <Fuel size={15} className="text-amber-500" />,
      label: 'Politique de carburant',
      val: 'Plein à plein (restitution avec le même niveau)',
    },
    {
      icon: <CheckCircle2 size={15} className="text-emerald-500" />,
      label: 'Annulation & Modification',
      val: 'Gratuite jusqu’à 48h avant la prise en charge',
    },
  ]

  // Services included
  const includedServices = [
    'Assurance tous risques tous dommages avec franchise 0 €',
    'Véhicule relais garanti sur site en moins de 60 minutes',
    'Assistance dépannage 24/7 partout au Maroc',
    'Nettoyage et désinfection complète certifiée avant livraison',
    'Second conducteur offert sans supplément',
    'Déverrouillage mobile par smartphone sans passage au guichet',
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-car-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-[96vw] max-w-7xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Navigation Bar ───────────────────────────────── */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-900/90 backdrop-blur-md flex items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
              {categoryLabel(t, car.category?.name)}
            </span>
            <div className="min-w-0">
              <h2
                id="modal-car-title"
                className="text-lg sm:text-xl font-black text-stone-900 dark:text-white truncate flex items-center gap-2"
              >
                <span>{car.brand} {car.model}</span>
                {car.productionYear && (
                  <span className="text-xs font-bold text-stone-400">({car.productionYear})</span>
                )}
              </h2>
            </div>
            {isElectricOrHybrid && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                <Zap size={11} /> Électrique / Hybride
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t('available')} · Prêt au départ
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('catalogueExtra.closeModal')}
              className="w-9 h-9 rounded-full bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-300/60 dark:border-stone-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body: Full Panoramic Layout ──────────── */}
        <div
          className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-7 space-y-6"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Main 2-Column Grid on Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* ══ LEFT / MAIN COLUMN: Vehicle Showcase & Specs (lg:col-span-7 xl:col-span-8) ══ */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">

              {/* Panoramic Car Showcase with Angle Selector */}
              <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-950 overflow-hidden shadow-xl flex flex-col relative">
                {/* Vehicle Display Area */}
                <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[400px] bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 flex items-center justify-center overflow-hidden">
                  <img
                    src={currentImage}
                    alt={`${car.brand} ${car.model} - ${angles[selectedAngle]?.label}`}
                    className={`w-full h-full transition-all duration-300 ${
                      isFullView ? 'object-contain p-4' : 'object-cover object-center'
                    }`}
                  />

                  {/* Gradient bottom shadow */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />

                  {/* Top-left Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-stone-900/80 text-amber-400 border border-amber-500/40 backdrop-blur-md shadow-md">
                      {angles[selectedAngle]?.label}
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-900/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                      <Sparkles size={11} /> Inspection 120 points validée
                    </span>
                  </div>

                  {/* Top-right Fit Toggle button */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsFullView(!isFullView)}
                      title={isFullView ? 'Ajuster au cadre' : 'Voir tout le véhicule sans rognage'}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-900/85 hover:bg-stone-800 text-stone-200 border border-stone-700/60 backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                    >
                      {isFullView ? (
                        <>
                          <Minimize2 size={13} />
                          <span>Plein cadre</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 size={13} />
                          <span>Vue intégrale</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Registration plate tag bottom-left */}
                  {car.registrationNumber && (
                    <div className="absolute bottom-4 left-4">
                      <div className="px-3 py-1 rounded-lg bg-stone-900/90 text-stone-200 border border-stone-700/70 font-mono text-xs font-extrabold tracking-widest backdrop-blur-md flex items-center gap-2 shadow-md">
                        <MapPin size={12} className="text-amber-500" />
                        <span>{car.registrationNumber}</span>
                      </div>
                    </div>
                  )}

                  {/* Brand & Model watermark bottom-right */}
                  <div className="absolute bottom-4 right-4 text-right pointer-events-none">
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 drop-shadow">
                      {car.brand}
                    </p>
                    <p className="text-lg sm:text-xl font-black text-white drop-shadow">
                      {car.model}
                    </p>
                  </div>
                </div>

                {/* Angle Selector Bar */}
                <div className="p-3 bg-stone-900/90 border-t border-stone-800/80 flex items-center justify-between gap-2 overflow-x-auto">
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 hidden sm:inline">
                      Angles de vue :
                    </span>
                    {angles.map((angle, idx) => (
                      <button
                        key={angle.id}
                        type="button"
                        onClick={() => setSelectedAngle(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          selectedAngle === idx
                            ? 'bg-amber-500 text-stone-950 shadow-md font-black ring-2 ring-amber-400/50'
                            : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700/80 hover:text-white border border-stone-700/60'
                        }`}
                      >
                        <Radio size={11} className={selectedAngle === idx ? 'animate-pulse' : ''} />
                        <span>{angle.label}</span>
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] text-stone-500 shrink-0 hidden md:block">
                    Photos contractuelles certifiées Nova Drive
                  </span>
                </div>
              </div>

              {/* Comprehensive Technical Sheet */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-2">
                    <Gauge size={14} className="text-amber-500" />
                    <span>Fiche Technique Complète</span>
                  </h3>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    10 caractéristiques détaillées
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
                  {specs.map((spec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 flex flex-col justify-between gap-2 hover:border-amber-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-stone-400 dark:text-stone-400 font-bold uppercase tracking-wider">
                          {spec.label}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            spec.accent === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {spec.icon}
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Onboard Equipment & Technologies */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Équipements de Série &amp; Confort Embarqué</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {equipment.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-700/50 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={13} strokeWidth={3} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rich Vehicle Description */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <FileText size={14} className="text-amber-500" />
                  <span>Description &amp; Expérience de Conduite</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {car.description ||
                    `La ${car.brand} ${car.model} allie une tenue de route irréprochable à un confort acoustique exceptionnel. Idéale pour les déplacements d'affaires, les réceptions officielles ou les trajets interurbains au Maroc, elle propose une conduite souple, sécurisée et économique avec tous les standards de la flotte Nova Drive.`}
                </p>
              </div>

              {/* Included Nova Drive Guarantees */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                  <ShieldCheck size={16} />
                  <span>Garanties &amp; Avantages Nova Drive inclus d'office</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {includedServices.map((service, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-stone-700 dark:text-stone-300 leading-snug">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ RIGHT COLUMN: Pricing, Simulation, Rental Terms & Bank RIBs (lg:col-span-5 xl:col-span-4) ══ */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-5">

              {/* Pricing Card & Fast Reservation Estimator */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-800 dark:to-stone-800/70 border border-stone-200 dark:border-stone-700 shadow-lg space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                      Tarif journalier garanti
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-4xl font-black text-stone-900 dark:text-stone-50">
                        {car.dailyBasePrice} €
                      </span>
                      <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                        / jour TTC
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 dark:text-stone-400 font-semibold block">
                      ~ {((car.dailyBasePrice || 0) * 10.8).toFixed(0)} MAD / jour
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                    <Sparkles size={12} /> B2B Pro
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-700 space-y-3">
                  <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider block flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-amber-500" />
                    Simulateur de séjour :
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">
                        Prise en charge
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">
                        Restitution
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-semibold text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-stone-600 dark:text-stone-300 block">
                        Durée estimée : <strong className="text-amber-600 dark:text-amber-400">{days} jour(s)</strong>
                      </span>
                      <span className="text-[10px] text-stone-400">Kilométrage illimité inclus</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                        {estimatedTotal} €
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        ~ {(estimatedTotal * 10.8).toFixed(0)} MAD
                      </span>
                    </div>
                  </div>

                  {/* Direct Action Reserve Button */}
                  <Link
                    to={`/cars/${car.id}`}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-xl shadow-amber-900/30 transition-all duration-150 cursor-pointer text-center group"
                  >
                    <span>Réserver ce véhicule</span>
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                  </Link>
                </div>
              </div>

              {/* Rental Conditions & Transparent Rules */}
              <div className="p-5 rounded-3xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-amber-500" />
                  <span>Conditions de Location</span>
                </h3>

                <div className="space-y-2.5">
                  {rentalConditions.map((cond, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs">
                      <div className="mt-0.5 shrink-0">{cond.icon}</div>
                      <div>
                        <span className="font-bold text-stone-700 dark:text-stone-200 block">
                          {cond.label}
                        </span>
                        <span className="text-stone-500 dark:text-stone-400 text-[11px] leading-tight">
                          {cond.val}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accepted Payment Modes & Bank RIB (CIH & Attijariwafa) */}
              <div className="p-5 rounded-3xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-2">
                    <CreditCard size={14} className="text-amber-500" />
                    <span>Règlement &amp; RIB Officiels</span>
                  </h3>
                  <span className="text-[10px] font-bold text-stone-400">Maroc &amp; International</span>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                  Paiement sécurisé par <strong>Virement Bancaire (RIB)</strong>, <strong>Carte Bancaire (CMI)</strong> ou <strong>Espèces</strong> à la livraison.
                </p>

                {/* Bank Accounts Mini Cards */}
                <div className="space-y-2.5 pt-1">
                  {BANK_ACCOUNTS.map((bank) => (
                    <div
                      key={bank.id}
                      className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/80 shadow-sm space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={bank.logo}
                            alt={bank.name}
                            className="h-5 w-auto object-contain rounded"
                          />
                          <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                            {bank.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-stone-400 uppercase">
                          Bénéficiaire : NOVA DRIVE
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/50">
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-stone-400 block uppercase">
                            RIB Bancaire
                          </span>
                          <span className="font-mono text-[11px] font-bold text-stone-800 dark:text-stone-200 truncate block">
                            {bank.rib}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(`rib-${bank.id}`, bank.rib.replace(/\s+/g, ''))}
                          title="Copier le RIB"
                          className="px-2.5 py-1.5 rounded-lg bg-stone-200/70 dark:bg-stone-700 hover:bg-amber-500 hover:text-stone-950 text-stone-700 dark:text-stone-200 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        >
                          {copiedKey === `rib-${bank.id}` ? (
                            <>
                              <Check size={11} className="text-emerald-500" />
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-stone-400 dark:text-stone-500 italic">
                  * Préciser votre numéro de réservation en motif lors de votre virement bancaire.
                </p>
              </div>

              {/* Direct Support & Assistance */}
              <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Phone size={14} />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-stone-900 dark:text-stone-100 block">
                      Assistance Nova Drive 24/7
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400">
                      Livraison aéroport &amp; hôtel sur demande
                    </span>
                  </div>
                </div>
                <a
                  href="tel:+212522000000"
                  className="px-3 py-1.5 rounded-xl text-[11px] font-black bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 transition-opacity shrink-0"
                >
                  Appeler
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sticky Bottom Action Bar ─────────────────────────── */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center justify-between gap-3 z-20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
          >
            {t('catalogueExtra.closeModal')}
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">
                Total estimé ({days}j)
              </span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                {estimatedTotal} € TTC
              </span>
            </div>

            <Link
              to={`/cars/${car.id}`}
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30 transition-all duration-150 cursor-pointer"
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

/* ── Multi-Angle Photo Generator per Brand ──────────────────── */
function getCarAngles(brand: string, model: string): CarAngle[] {
  const name = `${brand} ${model}`.toLowerCase()

  if (name.includes('bmw') || name.includes('serie') || name.includes('m4')) {
    return [
      {
        id: 'angle-1',
        label: 'Vue Globale 3/4',
        url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-2',
        label: 'Profil Latéral',
        url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-3',
        label: 'Cockpit & Habitacle',
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-4',
        label: 'Arrière & Coffre',
        url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=85',
      },
    ]
  }

  if (name.includes('mercedes') || name.includes('classe') || name.includes('amg')) {
    return [
      {
        id: 'angle-1',
        label: 'Vue Globale 3/4',
        url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-2',
        label: 'Profil Latéral',
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-3',
        label: 'Cockpit & Habitacle',
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-4',
        label: 'Arrière & Coffre',
        url: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1600&q=85',
      },
    ]
  }

  if (name.includes('audi') || name.includes('rs') || name.includes('a6') || name.includes('q7') || name.includes('a4')) {
    return [
      {
        id: 'angle-1',
        label: 'Vue Globale 3/4',
        url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-2',
        label: 'Profil Latéral',
        url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-3',
        label: 'Cockpit & Habitacle',
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-4',
        label: 'Arrière & Coffre',
        url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=85',
      },
    ]
  }

  if (name.includes('tesla') || name.includes('model') || name.includes('electric')) {
    return [
      {
        id: 'angle-1',
        label: 'Vue Globale 3/4',
        url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-2',
        label: 'Profil Latéral',
        url: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-3',
        label: 'Cockpit & Habitacle',
        url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-4',
        label: 'Arrière & Coffre',
        url: 'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?auto=format&fit=crop&w=1600&q=85',
      },
    ]
  }

  if (name.includes('porsche') || name.includes('taycan') || name.includes('911')) {
    return [
      {
        id: 'angle-1',
        label: 'Vue Globale 3/4',
        url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-2',
        label: 'Profil Latéral',
        url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-3',
        label: 'Cockpit & Habitacle',
        url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
      },
      {
        id: 'angle-4',
        label: 'Arrière & Coffre',
        url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1600&q=85',
      },
    ]
  }

  // Default rich set
  return [
    {
      id: 'angle-1',
      label: 'Vue Globale 3/4',
      url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1600&q=85',
    },
    {
      id: 'angle-2',
      label: 'Profil Latéral',
      url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1600&q=85',
    },
    {
      id: 'angle-3',
      label: 'Cockpit & Habitacle',
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=85',
    },
    {
      id: 'angle-4',
      label: 'Arrière & Coffre',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    },
  ]
}
