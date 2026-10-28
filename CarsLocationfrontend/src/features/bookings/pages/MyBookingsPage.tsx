import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Booking } from '../../../types'
import Loader from '../../../shared/components/Loader'
import { cancelBooking, getMyBookings } from '../services/bookingService'
import { statusLabel } from '../../../shared/utils/statusLabel'
import {
  CalendarCheck,
  Calendar,
  Clock,
  Car,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
  ShieldCheck,
  DollarSign,
  Filter,
  CreditCard,
  Copy,
  CheckCheck,
  Banknote,
  Info,
} from 'lucide-react'
import cihBankImg from '../../../assets/banks/cih_bank.jpg'
import attijariwafaImg from '../../../assets/banks/attijariwafa_bank.jpg'

/* ── RIB data ──────────────────────────────────────────────── */
const BANK_ACCOUNTS = [
  {
    id: 'cih',
    name: 'CIH Bank',
    logo: cihBankImg,
    rib: '230 780 4007678521001282 47',
    iban: 'MA64 2307 8040 0767 8521 0012 8247',
    accent: '#e05c1b',
    bg: 'rgba(224,92,27,0.08)',
    border: 'rgba(224,92,27,0.25)',
  },
  {
    id: 'attijariwafa',
    name: 'Attijariwafa Bank',
    logo: attijariwafaImg,
    rib: '007 780 0011234567890123 45',
    iban: 'MA64 0077 8000 1123 4567 8901 2345',
    accent: '#d4821a',
    bg: 'rgba(212,130,26,0.08)',
    border: 'rgba(212,130,26,0.25)',
  },
]

/* ── Copy-to-clipboard mini button ─────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copier"
      className="ml-1.5 inline-flex items-center justify-center w-6 h-6 rounded-md transition-all cursor-pointer"
      style={{ background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(120,120,120,0.12)' }}
    >
      {copied ? (
        <CheckCheck size={12} className="text-emerald-500" />
      ) : (
        <Copy size={12} className="text-stone-400 hover:text-stone-200" />
      )}
    </button>
  )
}

/* ── Payment Info Panel (shown inline under a WFP booking) ── */
function PaymentInfoPanel({ bookingRef, amount }: { bookingRef: string; amount: number }) {
  return (
    <div
      className="mt-4 rounded-2xl overflow-hidden border"
      style={{
        background: 'linear-gradient(135deg, rgba(30,22,10,0.97) 0%, rgba(20,15,5,0.99) 100%)',
        borderColor: 'rgba(212,130,26,0.35)',
        boxShadow: '0 8px 32px rgba(212,130,26,0.12), 0 2px 8px rgba(0,0,0,0.5)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center gap-2.5 border-b"
        style={{
          background: 'linear-gradient(90deg, rgba(212,130,26,0.18) 0%, transparent 100%)',
          borderColor: 'rgba(212,130,26,0.2)',
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(212,130,26,0.2)' }}
        >
          <Banknote size={16} className="text-amber-400" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-amber-400">
            Paiement par virement bancaire
          </p>
          <p className="text-[10px] text-stone-400 mt-0.5">
            Utilisez l&apos;un des comptes ci-dessous — référence obligatoire :{' '}
            <span className="font-mono font-bold text-amber-300">{bookingRef}</span>
          </p>
        </div>
      </div>

      {/* Amount reminder */}
      <div className="px-5 py-3 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <Info size={13} className="text-amber-500 shrink-0" />
        <p className="text-xs text-stone-300">
          Montant à virer :{' '}
          <span className="font-black text-white text-sm">{amount.toLocaleString('fr-FR')} MAD</span>
          <span className="text-stone-500 ml-1 text-[10px]">TTC · Assurance incluse</span>
        </p>
      </div>

      {/* Bank cards */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BANK_ACCOUNTS.map((bank) => (
          <div
            key={bank.id}
            className="rounded-xl p-4 flex flex-col gap-3 border transition-all"
            style={{ background: bank.bg, borderColor: bank.border }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center shrink-0 bg-white"
                style={{ borderColor: bank.border }}
              >
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <p className="text-xs font-extrabold text-white">{bank.name}</p>
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md"
                  style={{ background: bank.accent + '33', color: bank.accent }}
                >
                  Virement MAD
                </span>
              </div>
            </div>

            {/* RIB */}
            <div
              className="rounded-lg px-3 py-2.5 border"
              style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <p className="text-[9px] uppercase font-bold tracking-widest text-stone-500 mb-1">RIB</p>
              <div className="flex items-center justify-between gap-1">
                <code className="text-[11px] font-mono font-bold text-stone-200 break-all leading-tight">
                  {bank.rib}
                </code>
                <CopyButton text={bank.rib.replace(/\s/g, '')} />
              </div>
            </div>

            {/* IBAN */}
            <div
              className="rounded-lg px-3 py-2.5 border"
              style={{ background: 'rgba(0,0,0,0.35)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <p className="text-[9px] uppercase font-bold tracking-widest text-stone-500 mb-1">IBAN</p>
              <div className="flex items-center justify-between gap-1">
                <code className="text-[11px] font-mono font-bold text-stone-200 break-all leading-tight">
                  {bank.iban}
                </code>
                <CopyButton text={bank.iban.replace(/\s/g, '')} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div
        className="px-5 py-3 border-t flex items-start gap-2"
        style={{ borderColor: 'rgba(212,130,26,0.15)', background: 'rgba(0,0,0,0.2)' }}
      >
        <AlertCircle size={13} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-stone-500 leading-relaxed">
          Mentionnez impérativement votre numéro de réservation{' '}
          <span className="font-mono font-bold text-amber-400">{bookingRef}</span> comme référence du virement.
          Votre réservation sera confirmée dans les <strong className="text-stone-300">24–48h</strong> après
          réception du paiement.
        </p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   Main page component
═══════════════════════════════════════════════════════════════ */
export default function MyBookingsPage() {
  const { t } = useTranslation('common')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }, [t])

  const cancel = async (id: string) => {
    if (!window.confirm(`${t('cancel')} ?`)) return
    try {
      await cancelBooking(id)
      setBookings((items) =>
        items.map((item) => (item.id === id ? { ...item, status: 'CANCELLED' } : item)),
      )
    } catch {
      setError(t('error'))
    }
  }

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'ALL') return bookings
    return bookings.filter((b) => b.status === statusFilter)
  }, [bookings, statusFilter])

  const pendingCount = bookings.filter(
    (b) => b.status === 'PENDING' || b.status === 'WAITING_FOR_PAYMENT',
  ).length
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length
  const waitingPaymentCount = bookings.filter((b) => b.status === 'WAITING_FOR_PAYMENT').length

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader label={t('loading')} />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
            {t('clientPortal.badge')}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            {t('clientPortal.myBookings')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Suivi en temps réel de vos réservations, missions actives et contrats de mobilité.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-900/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>{t('clientPortal.newBooking')}</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Réservations</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CalendarCheck size={16} />
            </div>
          </div>
          <span className="text-2xl font-black text-stone-900 dark:text-stone-100 block mt-2">
            {bookings.length}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Confirmées / Actives</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <span className="text-2xl font-black text-stone-900 dark:text-stone-100 block mt-2">
            {confirmedCount}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">En cours de traitement</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <span className="text-2xl font-black text-stone-900 dark:text-stone-100 block mt-2">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-stone-200 dark:border-stone-800">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'ALL'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Toutes ({bookings.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'CONFIRMED'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Confirmées ({confirmedCount})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('PENDING')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'PENDING'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          En attente ({bookings.filter((b) => b.status === 'PENDING').length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('WAITING_FOR_PAYMENT')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'WAITING_FOR_PAYMENT'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <CreditCard size={11} />
            En attente de paiement ({waitingPaymentCount})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            statusFilter === 'CANCELLED'
              ? 'bg-stone-700 text-white shadow-xs'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
          }`}
        >
          Annulées ({bookings.filter((b) => b.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Bookings List Cards */}
      {filteredBookings.length ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED'
            const isPending = booking.status === 'PENDING'
            const isWaitingPayment = booking.status === 'WAITING_FOR_PAYMENT'
            const isCancelled = booking.status === 'CANCELLED' || booking.status === 'REJECTED'
            const bookingRef = booking.bookingNumber || `#NOVA-${booking.id.slice(0, 6)}`

            return (
              <article
                key={booking.id}
                className="rounded-2xl bg-white dark:bg-stone-900 border shadow-xs hover:shadow-md transition-all overflow-hidden"
                style={
                  isWaitingPayment
                    ? {
                        borderColor: 'rgba(234,88,12,0.5)',
                        boxShadow: '0 0 0 1px rgba(234,88,12,0.15), 0 4px 20px rgba(234,88,12,0.08)',
                      }
                    : {}
                }
              >
                {/* WAITING_FOR_PAYMENT top alert strip */}
                {isWaitingPayment && (
                  <div
                    className="px-5 py-2.5 flex items-center gap-2.5"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(234,88,12,0.15) 0%, rgba(234,88,12,0.05) 100%)',
                      borderBottom: '1px solid rgba(234,88,12,0.2)',
                    }}
                  >
                    <CreditCard size={14} className="text-orange-400 shrink-0" />
                    <p className="text-xs font-bold text-orange-400">
                      ⚡ Action requise — En attente de paiement par virement bancaire
                    </p>
                  </div>
                )}

                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                  {/* Vehicle & Reference Info */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0"
                      style={
                        isWaitingPayment
                          ? {
                              background: 'rgba(234,88,12,0.1)',
                              borderColor: 'rgba(234,88,12,0.3)',
                            }
                          : {
                              background: 'rgb(241,245,249)',
                            }
                      }
                    >
                      <Car
                        size={26}
                        className={isWaitingPayment ? 'text-orange-500' : 'text-amber-600 dark:text-amber-400'}
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono">
                          {bookingRef}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isConfirmed
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                              : isWaitingPayment
                              ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700'
                              : isPending
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isConfirmed
                                ? 'bg-emerald-500 animate-pulse'
                                : isWaitingPayment
                                ? 'bg-orange-500 animate-pulse'
                                : isPending
                                ? 'bg-amber-500 animate-pulse'
                                : 'bg-stone-400'
                            }`}
                          />
                          <span>{statusLabel(t, booking.status)}</span>
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 mt-1">
                        {booking.carBrandModel || 'Véhicule Nova Fleet'}
                      </h3>

                      {/* Dates Timeline */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1.5">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-amber-600" />
                          <span>
                            {new Date(booking.pickupDate).toLocaleDateString(undefined, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                        <span>→</span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-amber-600" />
                          <span>
                            {new Date(booking.returnDate).toLocaleDateString(undefined, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                        Montant Estimé
                      </span>
                      <span className="text-2xl font-black text-stone-900 dark:text-stone-100">
                        {booking.totalAmount || 0} €
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                        TTC & Assurance incluse
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!['CANCELLED', 'REJECTED', 'CONFIRMED'].includes(booking.status) && (
                        <button
                          type="button"
                          onClick={() => cancel(booking.id)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/60 transition-colors cursor-pointer"
                        >
                          {t('cancel')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Info Panel (WAITING_FOR_PAYMENT only) */}
                {isWaitingPayment && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <PaymentInfoPanel bookingRef={bookingRef} amount={booking.totalAmount || 0} />
                  </div>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <CalendarCheck size={26} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
              Aucune réservation trouvée
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Vous n&apos;avez aucune mission enregistrée dans cette catégorie pour le moment.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all"
          >
            <span>Explorer la flotte</span>
            <ArrowRight size={14} className="rtl:rotate-180" />
          </Link>
        </div>
      )}
    </div>
  )
}
