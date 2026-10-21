import { useEffect, useState } from 'react'
import type { Car, Category, Search } from '../../../types'
import { getAvailableCars, getCars, getCategories } from '../services/carService'

export function useCars() {
  const [cars, setCars] = useState<Car[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getCars(), getCategories()])
      .then(([nextCars, nextCategories]) => {
        setCars(nextCars)
        setCategories(nextCategories)
      })
      .catch(() => setError('Impossible de charger le catalogue.'))
      .finally(() => setLoading(false))
  }, [])

  const search = async (dates: Search) => {
    setLoading(true)
    setError('')
    try {
      const result = await getAvailableCars(`${dates.pickupDate}:00`, `${dates.returnDate}:00`)
      setCars(result)
    } catch {
      setError('Impossible de rechercher les disponibilités.')
    } finally {
      setLoading(false)
    }
  }

  return { cars, categories, loading, error, search }
}
