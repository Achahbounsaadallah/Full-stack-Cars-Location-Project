import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users as UsersIcon, Trash2, ShieldCheck, UserCheck, User as UserIcon } from 'lucide-react'

import type { User } from '../../../types'
import { deleteUser, getUsers } from '../services/userService'
import Loader from '../../../shared/components/Loader'

export default function UsersPage() {
  const { t } = useTranslation('common')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const remove = async (id: string) => {
    if (!window.confirm(t('delete') + '?')) return
    await deleteUser(id)
    setUsers((items) => items.filter((item) => item.id !== id))
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader label={t('loading')} />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            {t('admin')}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
            {t('users')}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {users.length} {t('users').toLowerCase()}
          </p>
        </div>
      </div>

      {/* Users Table / Grid Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/40 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 text-start">
                <th className="py-3 px-5 text-start">{t('users')}</th>
                <th className="py-3 px-5 text-start">{t('auth:email', { defaultValue: 'Email' })}</th>
                <th className="py-3 px-5 text-start">{t('status')}</th>
                <th className="py-3 px-5 text-start">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
              {users.map((user) => {
                const initials = `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase() || 'U'
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    {/* User Profile */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-700">
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 dark:text-stone-100">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-stone-400">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-5 font-mono text-xs text-stone-600 dark:text-stone-400">
                      {user.email}
                    </td>

                    {/* Role Pill */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900'
                            : user.role === 'EMPLOYEE'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900'
                            : 'bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700'
                        }`}
                      >
                        {user.role === 'ADMIN' ? (
                          <ShieldCheck size={13} />
                        ) : user.role === 'EMPLOYEE' ? (
                          <UserCheck size={13} />
                        ) : (
                          <UserIcon size={13} />
                        )}
                        <span>{t(`roles.${user.role}`, { defaultValue: user.role })}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => remove(user.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        title={t('delete')}
                      >
                        <Trash2 size={14} />
                        <span>{t('delete')}</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!users.length && (
          <div className="py-16 text-center text-sm text-stone-500 dark:text-stone-400">
            {t('noResults')}
          </div>
        )}
      </div>
    </div>
  )
}
