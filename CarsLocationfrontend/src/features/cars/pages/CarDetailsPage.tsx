import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Car } from '../../../types'
import { getCar } from '../services/carService'
import { createBooking } from '../../bookings/services/bookingService'
import { useAuth } from '../../auth/hooks/useAuth'
import Loader from '../../../shared/components/Loader'
import { getApiError } from '../../../shared/api/error'
import { vehicleLabel } from '../../../shared/utils/catalogueLabels'

export default function CarDetailsPage() {
  const { t } = useTranslation('common')
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [car, setCar] = useState<Car>()
  const [dates, setDates] = useState({ pickupDate: '', returnDate: '' })
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (id)
      getCar(id)
        .then(setCar)
        .catch(() => setMessage(t('vehicleNotFound')))
  }, [id])
  const reserve = async (event: FormEvent) => {
    event.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/cars/${id}` } } })
      return
    }
    if (!id) return
    try {
      await createBooking(id, `${dates.pickupDate}:00`, `${dates.returnDate}:00`)
      setMessage(t('bookingSubmitted'))
    } catch (error) {
      setMessage(getApiError(error, t('bookingError')))
    }
  }
  if (!car) return message ? <div className="state page-state">{message}</div> : <Loader />
  return (
    <main className="detail-page">
      <Link className="back" to="/">
        ← {t('backToCatalogue')}
      </Link>
      <div className="detail-grid">
        <div className="detail-image">
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85"
            alt={`${car.brand} ${car.model}`}
          />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{car.category?.name}</p>
          <h1>
            {car.brand}
            <br />
            <em>{car.model}</em>
          </h1>
          <div className="detail-specs">
            <span>
              <b>{car.seats}</b> {t('seats')}
            </span>
            <span>
              <b>{vehicleLabel(t, car.transmission)}</b>
            </span>
            <span>
              <b>{vehicleLabel(t, car.fuelType)}</b>
            </span>
          </div>
          <form className="booking-panel" onSubmit={reserve}>
            <input
              type="datetime-local"
              value={dates.pickupDate}
              onChange={(event) => setDates({ ...dates, pickupDate: event.target.value })}
              required
            />
            <input
              type="datetime-local"
              value={dates.returnDate}
              onChange={(event) => setDates({ ...dates, returnDate: event.target.value })}
              required
            />
            <button className="button button-accent full">{t('book')} ↗</button>
            {message && <p className="form-error">{message}</p>}
          </form>
        </div>
      </div>
    </main>
  )
}
