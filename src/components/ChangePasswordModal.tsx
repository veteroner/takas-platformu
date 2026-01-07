'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, X, Shield, Check, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { changePassword } from '@/lib/auth'
import Turnstile from './Turnstile'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { t } = useTranslation(['profile', 'common'])
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validatePassword = () => {
    if (!currentPassword) {
      setError(t('changePassword.errors.currentPasswordRequired'))
      return false
    }
    if (newPassword.length < 6) {
      setError(t('changePassword.errors.newPasswordMinLength', { min: 6 }))
      return false
    }
    if (newPassword === currentPassword) {
      setError(t('changePassword.errors.newPasswordMustDiffer'))
      return false
    }
    if (newPassword !== confirmPassword) {
      setError(t('changePassword.errors.passwordsDontMatch'))
      return false
    }
    if (!turnstileToken) {
      setError(t('changePassword.errors.botVerificationRequired'))
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validatePassword()) return

    try {
      setIsLoading(true)

      // Verify Turnstile token
      const turnstileResponse = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken })
      })

      if (!turnstileResponse.ok) {
        throw new Error(t('changePassword.errors.botVerificationFailed'))
      }

      // Change password
      await changePassword(currentPassword, newPassword)

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTurnstileToken(null)
        setSuccess(false)
      }, 2000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError(t('changePassword.errors.passwordChangeFailed'))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError(null)
      setTurnstileToken(null)
      setSuccess(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{t('changePassword.modalTitle')}</h2>
              <p className="text-purple-100 text-sm">{t('changePassword.modalSubtitle')}</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-green-800 font-semibold">{t('changePassword.successTitle')}</p>
                <p className="text-green-600 text-sm">{t('changePassword.successDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('changePassword.currentPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 placeholder:text-gray-500"
                placeholder={t('changePassword.currentPasswordPlaceholder')}
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading || success}
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('changePassword.newPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 placeholder:text-gray-500"
                placeholder={t('changePassword.newPasswordPlaceholder', { min: 6 })}
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading || success}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-700 mt-1">{t('changePassword.newPasswordHint', { min: 6 })}</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              {t('changePassword.confirmPasswordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 placeholder:text-gray-500"
                placeholder={t('changePassword.confirmPasswordPlaceholder')}
                disabled={isLoading || success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading || success}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Turnstile */}
          <div className="flex justify-center py-4">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
              onVerify={setTurnstileToken}
              onError={() => setError(t('changePassword.errors.botVerificationFailed'))}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading || success}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || success || !turnstileToken}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? t('changePassword.submitLoading')
                : success
                  ? t('changePassword.submitSuccess')
                  : t('changePassword.submitIdle')}
            </button>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <p className="text-xs text-blue-800">
              <strong>{t('changePassword.securityTipTitle')}</strong> {t('changePassword.securityTipBody')}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
