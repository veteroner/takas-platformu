'use client'

import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { resetPassword } from '@/lib/auth'
import { useTranslation } from 'react-i18next'

export default function ForgotPasswordPage() {
  const { t } = useTranslation('forgot-password')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (err: unknown) {
      console.error('Reset password error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu. Lütfen tekrar deneyin.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
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
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('title')}
            </h1>
            <p className="text-white/70">
              {t('subtitle')}
            </p>
          </div>

          {success ? (
            // Success State
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">
                {t('successTitle')}
              </h2>
              <p className="text-white/80 mb-6">
                <span className="font-medium text-white">{email}</span> {t('successMessage', { email: '' }).replace(email, '')}
              </p>
              <div className="bg-white/10 rounded-xl p-4 mb-6 text-left">
                <p className="text-white/80 text-sm">
                  {t('successTip')}
                </p>
              </div>
              <Link
                href="/login"
                className="w-full bg-white text-purple-600 font-semibold py-4 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              >
                {t('backToLoginButton')}
              </Link>
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

              {/* Email Field */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-white text-purple-600 font-semibold py-4 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  'Sıfırlama Linki Gönder'
                )}
              </button>

              {/* Info */}
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-white/70 text-sm text-center">
                  🔒 Hesabınıza kayıtlı e-posta adresini kullanın
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          Hesabınız yok mu?{' '}
          <Link href="/login" className="text-white hover:underline">
            Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  )
}
