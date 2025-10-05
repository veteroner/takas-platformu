'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { signIn, signUp } from '@/lib/auth'

export default function LoginPage() {
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
          setError('Şifreler eşleşmiyor')
          return
        }
        if (formData.password.length < 6) {
          setError('Şifre en az 6 karakter olmalıdır')
          return
        }
        
        await signUp(formData.email, formData.password, formData.name)
        setError('Kayıt başarılı! Email adresinizi kontrol edin.')
        
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
      setError(err.message || 'Bir hata oluştu')
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
          Ana Sayfa
        </Link>

        {/* Form Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isRegister ? 'Hesap Oluştur' : 'Giriş Yap'}
            </h1>
            <p className="text-white/70">
              {isRegister 
                ? 'Değiştir topluluğuna katıl' 
                : 'Hesabına giriş yap'
              }
            </p>
          </div>

          {/* Demo Credentials - Removed for real auth */}
          {!isRegister && (
            <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
              <h3 className="text-white font-medium mb-2">💡 Bilgi:</h3>
              <p className="text-white/80 text-sm">Yeni hesap oluşturun veya mevcut hesabınızla giriş yapın</p>
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
                placeholder="Email"
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
                placeholder="Şifre"
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

            {/* Confirm Password Field (Register only) */}
            {isRegister && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Şifre Tekrar"
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
                  ? 'Zaten hesabın var mı? Giriş yap' 
                  : 'Hesabın yok mu? Hesap oluştur'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
