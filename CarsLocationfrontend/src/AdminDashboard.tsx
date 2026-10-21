import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from './api'
import type { Booking, Car, Category, Maintenance, MaintenanceStatus } from './types'

const emptyForm = {
  registrationNumber: '',
  brand: '',
  model: '',
  productionYear: new Date().getFullYear(),
  seats: 5,
  transmission: 'Automatique',
  fuelType: 'Essence',
  dailyBasePrice: 50,
  status: 'AVAILABLE',
  mileage: 0,
  description: '',
  categoryId: '',
}
const euro = (value = 0) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
const date = (value?: string) => (value ? new Date(value).toLocaleString('fr-FR') : 'Non définie')

export default function AdminDashboard({ onAuth }: { onAuth: () => void }) {
  const navigate = useNavigate()
  const [cars, setCars] = useState<Car[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [form, setForm] = useState(emptyForm)
  const [maintenance, setMaintenance] = useState({
    carId: '',
    startDate: '',
    endDate: '',
    description: '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const load = async () => {
    setLoading(true)
    setMessage('')
    try {
      const [nextCars, nextCategories, nextBookings, nextMaintenances] = await Promise.all([
        api.cars(),
        api.categories(),
        api.allBookings(),
        api.maintenances(),
      ])
      setCars(nextCars)
      setCategories(nextCategories)
      setBookings(nextBookings.filter((item) => item.status === 'PENDING'))
      setMaintenances(nextMaintenances)
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Erreur de chargement'
      setMessage(
        text.includes('403')
          ? 'Accès refusé (403). Déconnectez-vous puis reconnectez-vous avec un compte ADMIN ou EMPLOYEE.'
          : text,
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  const addCar = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const created = await api.createCar(form)
      setCars((items) => [...items, created])
      setMessage('Voiture ajoutée.')
      setForm({ ...emptyForm, categoryId: form.categoryId })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Ajout impossible.')
    }
  }
  const changeCarStatus = async (car: Car, status: string) => {
    try {
      const updated = await api.updateCar(car.id, { ...car, categoryId: car.category?.id, status })
      setCars((items) => items.map((item) => (item.id === updated.id ? updated : item)))
      setMessage(`${car.brand} ${car.model} est maintenant ${status}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Modification impossible.')
    }
  }
  const removeCar = async (car: Car) => {
    if (!confirm(`Supprimer ${car.brand} ${car.model} ?`)) return
    try {
      await api.deleteCar(car.id)
      setCars((items) => items.filter((item) => item.id !== car.id))
      setMessage('Voiture supprimée.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Suppression impossible.')
    }
  }
  const addMaintenance = async (event: FormEvent) => {
    event.preventDefault()
    try {
      await api.createMaintenance(maintenance.carId, {
        startDate: maintenance.startDate,
        endDate: maintenance.endDate || null,
        description: maintenance.description,
        status: 'SCHEDULED',
        cost: 0,
      })
      setMessage('Maintenance planifiée.')
      setMaintenance({ ...maintenance, startDate: '', endDate: '', description: '' })
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Planification impossible.')
    }
  }
  const updateMaintenance = async (item: Maintenance, status: MaintenanceStatus) => {
    try {
      const updated = await api.updateMaintenance(item.id, { ...item, status, car: undefined })
      setMaintenances((items) => items.map((value) => (value.id === updated.id ? updated : value)))
      setMessage('Statut de maintenance mis à jour.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Modification impossible.')
    }
  }
  const bookingAction = async (booking: Booking, action: 'approve' | 'reject') => {
    try {
      const updated =
        action === 'approve'
          ? await api.approveBooking(booking.id)
          : await api.rejectBooking(booking.id)
      setBookings((items) => items.filter((item) => item.id !== updated.id))
      setMessage(
        action === 'approve' ? 'Demande acceptée, en attente de paiement.' : 'Demande refusée.',
      )
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action impossible.')
    }
  }
  return (
    <>
      <header className="header">
        <Link className="brand" to="/">
          <span>ND</span> NOVA DRIVE
        </Link>
        <nav>
          <Link to="/">Catalogue</Link>
          <Link className="active" to="/admin">
            Administration
          </Link>
        </nav>
        <div className="header-actions">
          <Link className="text-button" to="/admin/maintenance">
            Vue maintenance
          </Link>
          <button
            className="text-button"
            onClick={() => {
              localStorage.removeItem('nova_token')
              navigate('/')
            }}
          >
            Se déconnecter
          </button>
        </div>
      </header>
      <main className="admin-page">
        <p className="eyebrow">ESPACE PROFESSIONNEL</p>
        <h1>
          Pilotage <em>Nova Drive.</em>
        </h1>
        {message && <div className="admin-message">{message}</div>}
        <section className="admin-section">
          <div className="section-top">
            <div>
              <p className="eyebrow">DEMANDES CLIENTS</p>
              <h2>
                Réservations <em>à traiter.</em>
              </h2>
              <p className="muted">
                Les clients affichés ici ont demandé la location d'une voiture.
              </p>
            </div>
            <button className="button button-dark small" onClick={load}>
              Actualiser
            </button>
          </div>
          {loading ? (
            <div className="state">Chargement...</div>
          ) : bookings.length ? (
            <div className="booking-list">
              {bookings.map((item) => (
                <article className="booking" key={item.id}>
                  <div>
                    <p className="eyebrow">
                      {item.bookingNumber} · {item.clientEmail}
                    </p>
                    <h3>{item.carBrandModel}</h3>
                    <p>
                      {date(item.pickupDate)} → {date(item.returnDate)}
                    </p>
                    <small>{item.clientNumber || 'Téléphone non renseigné'}</small>
                  </div>
                  <div className="booking-meta">
                    <strong>{euro(item.totalAmount)}</strong>
                    <span className="status pending">PENDING</span>
                    <button className="text-button" onClick={() => bookingAction(item, 'reject')}>
                      Refuser
                    </button>
                    <button
                      className="button button-accent small"
                      onClick={() => bookingAction(item, 'approve')}
                    >
                      Confirmer la demande
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="state">Aucune demande PENDING.</div>
          )}
        </section>
        <section className="admin-section">
          <p className="eyebrow">FLOTTE ET DISPONIBILITÉ</p>
          <h2>
            Ajouter une <em>voiture.</em>
          </h2>
          <form className="admin-form" onSubmit={addCar}>
            <input
              placeholder="Immatriculation"
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              required
            />
            <input
              placeholder="Marque"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              required
            />
            <input
              placeholder="Modèle"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              required
            />
            <input
              type="number"
              min="1900"
              value={form.productionYear}
              onChange={(e) => setForm({ ...form, productionYear: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              min="1"
              value={form.seats}
              onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
              required
            />
            <input
              type="number"
              min="0"
              value={form.dailyBasePrice}
              onChange={(e) => setForm({ ...form, dailyBasePrice: Number(e.target.value) })}
              required
            />
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              <option value="">Catégorie</option>
              {categories.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Boîte"
              value={form.transmission}
              onChange={(e) => setForm({ ...form, transmission: e.target.value })}
              required
            />
            <input
              placeholder="Énergie"
              value={form.fuelType}
              onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
              required
            />
            <button className="button button-accent" type="submit">
              Ajouter la voiture
            </button>
          </form>
          <div className="admin-cars">
            {cars.map((car) => (
              <article key={car.id}>
                <div>
                  <strong>
                    {car.brand} {car.model}
                  </strong>
                  <span>
                    {car.registrationNumber} · {euro(car.dailyBasePrice)}/jour
                  </span>
                </div>
                <div className="admin-car-actions">
                  <select value={car.status} onChange={(e) => changeCarStatus(car, e.target.value)}>
                    <option value="AVAILABLE">Disponible</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="RENTED">Louée</option>
                    <option value="CLEANING">Nettoyage</option>
                    <option value="OUT_OF_SERVICE">Hors service</option>
                  </select>
                  <button className="text-button" onClick={() => removeCar(car)}>
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="admin-section">
          <p className="eyebrow">PLANIFICATION</p>
          <h2>
            Mettre une voiture en <em>maintenance.</em>
          </h2>
          <form className="admin-form" onSubmit={addMaintenance}>
            <select
              value={maintenance.carId}
              onChange={(e) => setMaintenance({ ...maintenance, carId: e.target.value })}
              required
            >
              <option value="">Choisir une voiture</option>
              {cars.map((car) => (
                <option value={car.id} key={car.id}>
                  {car.brand} {car.model} · {car.registrationNumber}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={maintenance.startDate}
              onChange={(e) => setMaintenance({ ...maintenance, startDate: e.target.value })}
              required
            />
            <input
              type="datetime-local"
              value={maintenance.endDate}
              onChange={(e) => setMaintenance({ ...maintenance, endDate: e.target.value })}
              required
            />
            <input
              placeholder="Raison"
              value={maintenance.description}
              onChange={(e) => setMaintenance({ ...maintenance, description: e.target.value })}
              required
            />
            <button className="button button-accent" type="submit">
              Planifier
            </button>
          </form>
          <div className="admin-cars">
            {maintenances.map((item) => (
              <article key={item.id}>
                <div>
                  <strong>
                    {item.car?.brand} {item.car?.model}
                  </strong>
                  <span>
                    {item.description || 'Sans description'} · {date(item.startDate)} →{' '}
                    {date(item.endDate)}
                  </span>
                </div>
                <div className="admin-car-actions">
                  <select
                    value={item.status}
                    onChange={(e) => updateMaintenance(item, e.target.value as MaintenanceStatus)}
                  >
                    <option value="SCHEDULED">Planifiée</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="COMPLETED">Terminée</option>
                    <option value="CANCELLED">Annulée</option>
                  </select>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
