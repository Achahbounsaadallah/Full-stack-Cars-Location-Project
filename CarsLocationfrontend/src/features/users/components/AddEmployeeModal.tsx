import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  X,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PauseCircle,
  Ban,
} from 'lucide-react'
import { createUser, type CreateUserPayload } from '../services/userService'
import type { UserStatus } from '../../../types'
import { getApiError } from '../../../shared/api/error'

interface AddEmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onEmployeeAdded: () => void
}

const INITIAL_FORM: CreateUserPayload = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  role: 'EMPLOYEE',
  status: 'ACTIVE',
}

export default function AddEmployeeModal({
  isOpen,
  onClose,
  onEmployeeAdded,
}: AddEmployeeModalProps) {
  const { t } = useTranslation('common')
  const [form, setForm] = useState<CreateUserPayload>(INITIAL_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) handleClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, submitting])

  const handleClose = () => {
    if (submitting) return
    setForm(INITIAL_FORM)
    setError('')
    setSuccess(false)
    setShowPassword(false)
    onClose()
  }

  if (!isOpen) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Veuillez remplir tous les champs obligatoires (*).')
      return
    }

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    try {
      setSubmitting(true)
      await createUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        phone: form.phone?.trim() || undefined,
        role: form.role || 'EMPLOYEE',
        status: form.status || 'ACTIVE',
      })
      setSuccess(true)
      setTimeout(() => {
        onEmployeeAdded()
        handleClose()
      }, 1400)
    } catch (err: unknown) {
      setError(getApiError(err, "Impossible d'ajouter l'employé. Veuillez vérifier les informations."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                Ajouter un Employé
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Créer les identifiants d’accès pour un membre de l'équipe
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="w-8 h-8 rounded-full bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Success Banner */}
          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-xs font-bold animate-in fade-in">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <span>L’employé a été créé avec succès ! Actualisation en cours...</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">
                Prénom <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Mohamed"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">
                Nom <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Alami"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">
              Email Professionnel <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                required
                placeholder="Ex: m.alami@novadrive.ma"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">
              Numéro de Téléphone
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="tel"
                placeholder="Ex: +212 6 12 34 56 78"
                value={form.phone || ''}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Initial Password */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">
              Mot de Passe Initial <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="Au moins 6 caractères"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">
              Rôle du Compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  form.role === 'EMPLOYEE'
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/20'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="EMPLOYEE"
                  checked={form.role === 'EMPLOYEE'}
                  onChange={() => setForm({ ...form, role: 'EMPLOYEE' })}
                  className="sr-only"
                />
                <UserCheck size={16} className={form.role === 'EMPLOYEE' ? 'text-blue-600' : 'text-stone-400'} />
                <div className="text-xs">
                  <span className="font-bold block">Employé</span>
                  <span className="text-[10px] text-stone-400">Opérations &amp; Flotte</span>
                </div>
              </label>

              <label
                className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                  form.role === 'ADMIN'
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="ADMIN"
                  checked={form.role === 'ADMIN'}
                  onChange={() => setForm({ ...form, role: 'ADMIN' })}
                  className="sr-only"
                />
                <ShieldCheck size={16} className={form.role === 'ADMIN' ? 'text-amber-600' : 'text-stone-400'} />
                <div className="text-xs">
                  <span className="font-bold block">Administrateur</span>
                  <span className="text-[10px] text-stone-400">Accès intégral</span>
                </div>
              </label>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 mb-1.5 flex items-center justify-between">
              <span>
                Statut Initial du Compte <span className="text-rose-500">*</span>
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Requis par le backend</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* ACTIVE */}
              <label
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all ${
                  form.status === 'ACTIVE'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="ACTIVE"
                  checked={form.status === 'ACTIVE'}
                  onChange={() => setForm({ ...form, status: 'ACTIVE' })}
                  className="sr-only"
                />
                <CheckCircle2
                  size={18}
                  className={form.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}
                />
                <div>
                  <span className="font-bold block text-xs">Actif</span>
                  <span className="text-[10px] text-stone-400">Accès direct</span>
                </div>
              </label>

              {/* INACTIVE */}
              <label
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all ${
                  form.status === 'INACTIVE'
                    ? 'bg-stone-200/70 dark:bg-stone-800 border-stone-500 text-stone-900 dark:text-stone-100 ring-2 ring-stone-400/20 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="INACTIVE"
                  checked={form.status === 'INACTIVE'}
                  onChange={() => setForm({ ...form, status: 'INACTIVE' })}
                  className="sr-only"
                />
                <PauseCircle
                  size={18}
                  className={form.status === 'INACTIVE' ? 'text-stone-700 dark:text-stone-300' : 'text-stone-400'}
                />
                <div>
                  <span className="font-bold block text-xs">Inactif</span>
                  <span className="text-[10px] text-stone-400">En attente</span>
                </div>
              </label>

              {/* SUSPENDED */}
              <label
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all ${
                  form.status === 'SUSPENDED'
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="SUSPENDED"
                  checked={form.status === 'SUSPENDED'}
                  onChange={() => setForm({ ...form, status: 'SUSPENDED' })}
                  className="sr-only"
                />
                <Ban
                  size={18}
                  className={form.status === 'SUSPENDED' ? 'text-rose-600 dark:text-rose-400' : 'text-stone-400'}
                />
                <div>
                  <span className="font-bold block text-xs">Suspendu</span>
                  <span className="text-[10px] text-stone-400">Accès bloqué</span>
                </div>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={submitting || success}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30 transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Création en cours...</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Créer l'employé</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
