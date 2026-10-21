import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  X,
  PhoneCall,
  MapPin,
  Mail,
  Zap,
  Headphones,
} from 'lucide-react'

interface ClientSupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ClientSupportModal({ isOpen, onClose }: ClientSupportModalProps) {
  const { t } = useTranslation('common')

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

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 pb-4 sm:px-6 sm:pb-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col text-stone-900 dark:text-stone-100"
        style={{ maxHeight: 'calc(100vh - 100px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header Banner */}
        <div className="relative bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 px-6 py-4 text-white border-b border-stone-800 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Headphones size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
              Assistance Prioritaire
            </span>
            <h2 id="support-modal-title" className="text-base font-black text-white leading-tight">
              Support 24/7 — {t('clientPortal.supportModalTitle')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('catalogueExtra.closeModal')}
            className="shrink-0 w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-stone-700/60"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">

          {/* Description */}
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {t('clientPortal.supportModalDesc')}
          </p>

          {/* Emergency Hotline Button */}
          <a
            href="tel:+33189450024"
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg shadow-amber-900/30 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <PhoneCall size={19} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 block">
                  Ligne Régulation 24h/24 &amp; 7j/7
                </span>
                <span className="text-lg font-black tracking-tight block">
                  {t('clientPortal.supportEmergencyPhone')}
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-lg bg-white/20 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              Appel direct
            </span>
          </a>

          {/* SLA Highlight */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
              <Zap size={14} className="text-amber-500 shrink-0" />
              <span>Engagement SLA Contrat Entreprise</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              En cas d'incident mécanique ou imprévu, notre cellule mobile achemine un véhicule de catégorie équivalente ou supérieure directement sur votre lieu de mission en{' '}
              <strong>moins de 60 minutes chrono</strong>.
            </p>
          </div>

          {/* Email & Hub Locations */}
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-stone-500 dark:text-stone-400 shrink-0">
                <Mail size={14} className="text-amber-600" />
                <span>Email dispatch :</span>
              </span>
              <a
                href={`mailto:${t('clientPortal.supportEmail')}`}
                className="font-bold text-stone-800 dark:text-stone-200 hover:text-amber-600 transition-colors truncate"
              >
                {t('clientPortal.supportEmail')}
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/60 flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2 text-stone-500 dark:text-stone-400 shrink-0">
                <MapPin size={14} className="text-amber-600" />
                <span>Hubs d'intervention :</span>
              </span>
              <span className="font-bold text-stone-800 dark:text-stone-200 text-right">
                Paris Opéra • CDG • Lyon • Marseille
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 sm:px-6 bg-stone-50 dark:bg-stone-950/40 border-t border-stone-200 dark:border-stone-800 flex justify-end shrink-0">
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
