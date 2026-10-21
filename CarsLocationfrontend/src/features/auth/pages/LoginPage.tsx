import { useState, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'
import { getApiError } from '../../../shared/api/error'
import LanguageSwitcher from '../../../shared/components/LanguageSwitcher'
import Logo from '../../../shared/components/Logo'
import { createLoginSchema, type LoginFormData } from '../schemas/authSchemas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/ui/card'
import { Button } from '../../../shared/components/ui/button'
import { Input } from '../../../shared/components/ui/input'
import { Label } from '../../../shared/components/ui/label'

export default function LoginPage() {
  const { t } = useTranslation('auth')
  const { t: tc } = useTranslation('common')
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const loginSchema = useMemo(() => createLoginSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError('')
    try {
      await signIn({ email: data.email, password: data.password })
      const destination = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'
      navigate(destination)
    } catch (reason) {
      setServerError(getApiError(reason, t('invalidCredentials')))
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative bg-stone-100 dark:bg-stone-950 overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-stone-400/15 blur-3xl" />
      </div>

      {/* Top Bar with Brand & Language */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between mb-8 z-10 px-2">
        <Link to="/" className="inline-flex items-center gap-2 group transition-transform hover:scale-[1.02]">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main Container - Split View on desktop */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch z-10">
        {/* Left Side: Login Form Card (shadcn/ui Card) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <Card className="border border-stone-200/90 shadow-2xl bg-white/95 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/95">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-amber-200/60 dark:border-amber-800/50">
                  <ShieldCheck size={13} />
                  <span>{tc('appName')}</span>
                </span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 pt-2">
                {t('loginTitle')}
              </CardTitle>
              <CardDescription className="text-sm text-stone-500 dark:text-stone-400">
                {t('loginSubtitle')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {serverError && (
                <div className="mb-5 p-3.5 rounded-xl text-sm font-medium bg-red-50 text-red-700 border border-red-200/80 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/50 flex items-center gap-2 animate-in fade-in duration-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  <p>{serverError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-stone-700 dark:text-stone-300">
                    {t('email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={17} />
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder={t('emailPlaceholder')}
                      error={!!errors.email}
                      className="ps-10 text-stone-900 dark:text-stone-100"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium ps-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-stone-700 dark:text-stone-300">
                      {t('password')}
                    </Label>
                    <span className="text-xs text-amber-700 dark:text-amber-400 hover:underline cursor-pointer">
                      {t('forgotPassword')}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={17} />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder={t('passwordPlaceholder')}
                      error={!!errors.password}
                      className="ps-10 pe-10 text-stone-900 dark:text-stone-100"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium ps-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full mt-2 font-semibold shadow-md shadow-amber-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{t('signingIn')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('login')}</span>
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                    </>
                  )}
                </Button>
              </form>

              {/* Bottom Register Redirect */}
              <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 text-center">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  {t('noAccount')}{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 underline-offset-4 hover:underline"
                  >
                    {t('register')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Corporate Perks & Visual Highlights */}
        <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 rounded-2xl bg-stone-900 text-stone-100 shadow-2xl relative overflow-hidden border border-stone-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-stone-800 px-3 py-1 rounded-full border border-amber-500/30">
              Nova Drive Business
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
              {t('trust.title')}
            </h2>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-stone-300 leading-relaxed">{t('trust.item1')}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-stone-300 leading-relaxed">{t('trust.item2')}</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-stone-300 leading-relaxed">{t('trust.item3')}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800/80 relative z-10 flex items-center justify-between text-xs text-stone-400">
            <span>© {new Date().getFullYear()} Nova Drive Inc.</span>
            <Link to="/" className="hover:text-stone-200 transition-colors">
              {tc('catalogue')} ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
