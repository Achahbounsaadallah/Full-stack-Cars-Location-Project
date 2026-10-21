import type { TFunction } from 'i18next'

export function statusLabel(t: TFunction, status: string) {
  return t(`statuses.${status}`, { defaultValue: status })
}
