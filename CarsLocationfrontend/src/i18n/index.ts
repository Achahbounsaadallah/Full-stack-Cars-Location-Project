import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr/common.json'
import en from './locales/en/common.json'
import ar from './locales/ar/common.json'
import frAuth from './locales/fr/auth.json'
import enAuth from './locales/en/auth.json'
import arAuth from './locales/ar/auth.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { common: fr, auth: frAuth },
      en: { common: en, auth: enAuth },
      ar: { common: ar, auth: arAuth },
    },
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common', 'auth'],
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  })

const updateDirection = (language: string) => {
  const isArabic = language.startsWith('ar')
  document.documentElement.lang = isArabic ? 'ar' : language
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
}
updateDirection(i18n.language)
i18n.on('languageChanged', updateDirection)

export default i18n
