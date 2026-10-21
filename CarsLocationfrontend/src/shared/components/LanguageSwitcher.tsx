import { useTranslation } from 'react-i18next'
import { Globe, ChevronDown } from 'lucide-react'

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n, t } = useTranslation('common')
  const currentLang = i18n.language ? i18n.language.slice(0, 2) : 'en'

  return (
    <div className={`relative inline-flex items-center text-xs font-semibold ${className}`}>
      <span className="sr-only">{t('language')}</span>
      <div className="group relative flex items-center bg-stone-100 hover:bg-stone-200/70 dark:bg-stone-800 dark:hover:bg-stone-700/80 border border-stone-300 dark:border-stone-700 rounded-lg transition-all duration-150 shadow-xs">
        <Globe
          size={14}
          className="absolute left-2.5 rtl:left-auto rtl:right-2.5 text-stone-500 dark:text-stone-400 pointer-events-none transition-colors group-hover:text-amber-600 dark:group-hover:text-amber-400"
        />
        <select
          value={currentLang}
          onChange={(event) => i18n.changeLanguage(event.target.value)}
          aria-label={t('language')}
          className="cursor-pointer pl-8 pr-7 rtl:pl-7 rtl:pr-8 py-1.5 bg-transparent text-stone-800 dark:text-stone-100 font-semibold text-xs border-0 outline-none focus:ring-0 appearance-none transition-colors"
        >
          <option value="fr" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            FR
          </option>
          <option value="en" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            EN
          </option>
          <option value="ar" className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100">
            العربية
          </option>
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2 rtl:right-auto rtl:left-2 text-stone-400 dark:text-stone-500 pointer-events-none group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors"
        />
      </div>
    </div>
  )
}
