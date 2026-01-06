'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { updatePassword } from '@/lib/auth'
import { useTranslation } from 'react-i18next'

function ResetPasswordContent() {
  const router = useRouter()
  const { t } = useTranslation(['forgot-password','common'])
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Şifre gücü kontrolü
  const getPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  
  const strengthLabels: string[] = t('strengthLabels', { returnObjects: true }) as unknown as string[]
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validations
    if (password.length < 6) {
      setError(t('passwordTooShort'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('passwordsNotMatch'))
      return
    }

    setIsLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
      
      // 3 saniye sonra login'e yönlendir
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: unknown) {
      console.error('Update password error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Şifre güncellenirken bir hata oluştu'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-svh bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto overscroll-contain p-4">
        <div className="min-h-full flex items-center justify-center">
          <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/login"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          {t('backToLogin')}
        </Link>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('resetTitle')}
            </h1>
            <p className="text-white/70">
              {t('resetDesc')}
            </p>
          </div>

          {success ? (
            // Success State
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">
                {t('resetSuccessTitle')}
              </h2>
              <p className="text-white/80 mb-6">
                {t('resetSuccessDesc')}
              </p>
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              {/* Password Field */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('newPasswordPlaceholder') || t('resetTitle')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                      <p className="text-white/60 text-xs">
                      {t('passwordStrengthPrefix', { label: strengthLabels[passwordStrength - 1] || strengthLabels[0] })}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('confirmPasswordPlaceholder') || ''}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`flex items-center gap-2 text-sm ${
                  password === confirmPassword ? 'text-green-400' : 'text-red-400'
                }`}>
                      {password === confirmPassword ? (
                    <>
                      <CheckCircle size={16} />
                      {t('passwordsMatch')}
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      {t('passwordsNotMatch')}
                    </>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || password.length < 6 || password !== confirmPassword}
                className="w-full bg-white text-purple-600 font-semibold py-4 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                    {t('updating')}
                  </>
                ) : (
                  t('updateButton')
                )}
              </button>

              {/* Security Info */}
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white/70 text-sm text-center">
                  {t('strongPasswordTip')}
                </p>
              </div>
            </form>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="h-svh bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center overflow-hidden">
        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
