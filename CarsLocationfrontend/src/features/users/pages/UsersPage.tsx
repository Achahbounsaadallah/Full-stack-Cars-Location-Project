import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Trash2,
  ShieldCheck,
  UserCheck,
  User as UserIcon,
  UserPlus,
  Search,
  Filter,
  AlertCircle,
} from 'lucide-react'

import type { User } from '../../../types'
import { deleteUser, getUsers } from '../services/userService'
import Loader from '../../../shared/components/Loader'
import AddEmployeeModal from '../components/AddEmployeeModal'

export default function UsersPage() {
  const { t } = useTranslation('common')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'EMPLOYEE' | 'ADMIN' | 'CLIENT'>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'>('ALL')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadUsers = () => {
    setLoading(true)
    setError('')
    getUsers()
      .then(setUsers)
      .catch(() => setError(t('error')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${name}" ?`)) return
    try {
      setDeletingId(id)
      await deleteUser(id)
      setUsers((items) => items.filter((item) => item.id !== id))
    } catch {
      alert("Erreur lors de la suppression de l'utilisateur.")
    } finally {
      setDeletingId(null)
    }
  }

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false

      // Status filter
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase()
        const email = (u.email || '').toLowerCase()
        const phone = (u.phone || '').toLowerCase()
        if (!fullName.includes(q) && !email.includes(q) && !phone.includes(q)) {
          return false
        }
      }

      return true
    })
  }, [users, roleFilter, statusFilter, searchQuery])

  // Count employees
  const employeeCount = useMemo(() => users.filter((u) => u.role === 'EMPLOYEE').length, [users])
  const adminCount = useMemo(() => users.filter((u) => u.role === 'ADMIN').length, [users])
  const activeCount = useMemo(() => users.filter((u) => u.status === 'ACTIVE').length, [users])

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader label={t('loading')} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header with Title and Add Employee CTA Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {t('admin')}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            Gestion des Utilisateurs &amp; Équipe
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {users.length} utilisateur(s) · {employeeCount} employé(s) · {adminCount} admin(s) · {activeCount} actif(s)
          </p>
        </div>

        {/* Primary CTA: Add Employee Form Button */}
        <div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/25 transition-all duration-150 cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Ajouter un Employé</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center gap-2.5 text-xs font-semibold">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Role & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider hidden lg:inline">
              Statut :
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">● Actif</option>
              <option value="INACTIVE">● Inactif</option>
              <option value="SUSPENDED">● Suspendu</option>
            </select>
          </div>

          {/* Role Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 hidden md:inline flex items-center gap-1">
              <Filter size={12} />
              Rôle :
            </span>
            {(
              [
                { id: 'ALL', label: 'Tous' },
                { id: 'EMPLOYEE', label: 'Employés' },
                { id: 'ADMIN', label: 'Admins' },
                { id: 'CLIENT', label: 'Clients' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  roleFilter === tab.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table / Grid Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-start">
                <th className="py-3.5 px-5 text-start">Utilisateur</th>
                <th className="py-3.5 px-5 text-start">Coordonnées</th>
                <th className="py-3.5 px-5 text-start">Rôle</th>
                <th className="py-3.5 px-5 text-start">Statut</th>
                <th className="py-3.5 px-5 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
              {filteredUsers.map((user) => {
                const initials =
                  `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase() || 'U'
                const isDeleting = deletingId === user.id
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    {/* User Profile */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl font-bold text-xs flex items-center justify-center shrink-0 border ${
                            user.role === 'ADMIN'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                              : user.role === 'EMPLOYEE'
                              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                          }`}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span>
                              {user.firstName} {user.lastName}
                            </span>
                            {user.role === 'EMPLOYEE' && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                Staff
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-stone-400 font-mono">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <p className="font-mono text-xs text-stone-700 dark:text-stone-300">
                          {user.email}
                        </p>
                        {user.phone && (
                          <p className="text-[11px] text-stone-400">{user.phone}</p>
                        )}
                      </div>
                    </td>

                    {/* Role Pill */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'ADMIN'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
                            : user.role === 'EMPLOYEE'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900'
                            : 'bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
                        }`}
                      >
                        {user.role === 'ADMIN' ? (
                          <ShieldCheck size={14} />
                        ) : user.role === 'EMPLOYEE' ? (
                          <UserCheck size={14} />
                        ) : (
                          <UserIcon size={14} />
                        )}
                        <span>{t(`roles.${user.role}`, { defaultValue: user.role })}</span>
                      </span>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                            : user.status === 'SUSPENDED'
                            ? 'bg-rose-50 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
                            : 'bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-500'
                              : user.status === 'SUSPENDED'
                              ? 'bg-rose-500'
                              : 'bg-stone-400'
                          }`}
                        />
                        <span>
                          {user.status === 'ACTIVE'
                            ? 'Actif'
                            : user.status === 'INACTIVE'
                            ? 'Inactif'
                            : user.status === 'SUSPENDED'
                            ? 'Suspendu'
                            : user.status || 'Actif'}
                        </span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-end">
                      <button
                        type="button"
                        onClick={() => remove(user.id, `${user.firstName} ${user.lastName}`)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 disabled:opacity-50"
                        title={t('delete')}
                      >
                        <Trash2 size={14} />
                        <span>{isDeleting ? 'Suppression...' : t('delete')}</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!filteredUsers.length && (
          <div className="py-16 text-center text-sm text-stone-500 dark:text-stone-400 space-y-2">
            <p className="font-bold">{t('noResults')}</p>
            <p className="text-xs text-stone-400">
              Aucun utilisateur ne correspond à votre filtre actuel.
            </p>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeAdded={loadUsers}
      />
    </div>
  )
}
