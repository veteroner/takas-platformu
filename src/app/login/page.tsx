'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { signIn, signUp } from '@/lib/auth'
import { policyRoutes } from '@/lib/legal'

export default function LoginPage() {
  const { t } = useTranslation('login')
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          setError(t('errors.passwordMismatch'))
          return
        }
        if (formData.password.length < 6) {
          setError(t('errors.passwordTooShort'))
          return
        }
        
        const auth = await signUp(formData.email, formData.password, formData.name)
        const userId = auth.user?.id
        if (userId) {
          const marketing = (document.querySelector('input[name="consent_marketing"]') as HTMLInputElement | null)?.checked
          const emailConsent = (document.querySelector('input[name="consent_email"]') as HTMLInputElement | null)?.checked
          await fetch('/api/consents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              consents: [
                { policyKey: 'terms', version: 'v1' },
                { policyKey: 'kvkk', version: 'v1' },
                { policyKey: 'privacy', version: 'v1' },
                { policyKey: 'cookies', version: 'v1' },
                ...(marketing ? [{ policyKey: 'marketing', version: 'v1' }] : []),
                ...(emailConsent ? [{ policyKey: 'email', version: 'v1' }] : []),
              ]
            })
          })
          ;['terms','kvkk','privacy','cookies']
            .concat(marketing ? ['marketing'] : [])
            .concat(emailConsent ? ['email'] : [])
            .forEach(k => localStorage.setItem(`accepted_${k}`, 'v1'))
        }
        setError(t('registerSuccess'))
        
        // Auto login after signup
        setTimeout(async () => {
          await signIn(formData.email, formData.password)
          router.push('/')
        }, 2000)
      } else {
        await signIn(formData.email, formData.password)
        router.push('/')
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || t('errors.genericError'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          {t('backToHome')}
        </Link>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isRegister ? t('createAccount') : t('title')}
            </h1>
            <p className="text-white/70">
              {isRegister 
                ? t('registerSubtitle') 
                : t('loginSubtitle')
              }
            </p>
          </div>

          {/* Demo Credentials - Removed for real auth */}
          {!isRegister && (
            <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
              <h3 className="text-white font-medium mb-2">💡 Bilgi:</h3>
              <p className="text-white/80 text-sm">{t('loginInfo')}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Register only) */}
            {isRegister && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Ad Soyad"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type="email"
                name="email"
                placeholder={t('email')}
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t('password')}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Forgot Password Link (Login only) */}
            {!isRegister && (
              <div className="text-right -mt-2">
                <Link
                  href="/forgot-password"
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  {t('forgotPassword')}
                </Link>
              </div>
            )}

            {/* Confirm Password Field (Register only) */}
            {isRegister && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder={t('confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

          {/* Consents (Register only) */}
          {isRegister && (
            <div className="space-y-3 text-white/90">
              <label className="flex items-start gap-3">
                <input required type="checkbox" className="mt-1" />
                <span>
                  <Link className="underline" href={policyRoutes.terms}>Üyelik Sözleşmesi</Link>,{' '}
                  <Link className="underline" href={policyRoutes.kvkk}>KVKK Aydınlatma Metni</Link> ve{' '}
                  <Link className="underline" href={policyRoutes.privacy}>Gizlilik & Çerez Politikası</Link>'nı okudum, kabul ediyorum.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input name="consent_marketing" type="checkbox" className="mt-1" />
                <span>
                  Pazarlama/kişiselleştirme amaçlı işlenmesine <Link className="underline" href={policyRoutes.consent}>açık rıza</Link> veriyorum (opsiyonel).
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input name="consent_email" type="checkbox" className="mt-1" />
                <span>
                  Ticari elektronik ileti almayı kabul ediyorum (opsiyonel).
                </span>
              </label>
            </div>
          )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-100 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isRegister ? 'Hesap Oluşturuluyor...' : 'Giriş Yapılıyor...'}
                </div>
              ) : (
                isRegister ? 'Hesap Oluştur' : 'Giriş Yap'
              )}
            </button>

            {/* Toggle Register/Login */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister)
                  setError('')
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  })
                }}
                className="text-white/80 hover:text-white underline transition-colors"
              >
                {isRegister 
                  ? t('haveAccount') 
                  : t('noAccount')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
