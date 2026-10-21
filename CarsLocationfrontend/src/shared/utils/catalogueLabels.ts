import type { TFunction } from 'i18next'

export function categoryLabel(t: TFunction, name?: string) {
  if (!name) return t('selection')
  const key = name.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and')
  return t(`categories.${key}`, { defaultValue: name })
}

export function vehicleLabel(t: TFunction, value: string) {
  return t(`vehicleValues.${value.toUpperCase()}`, { defaultValue: value })
}
