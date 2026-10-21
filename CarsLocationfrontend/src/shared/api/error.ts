import axios from 'axios'

export function getApiError(error: unknown, fallback = 'Une erreur est survenue.') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string' && data) return data
    if (data?.message) return data.message
    if (data?.errorCode) return data.errorCode
  }
  return error instanceof Error ? error.message : fallback
}
