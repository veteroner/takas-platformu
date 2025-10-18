'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Package,
  Heart,
  MessageSquare,
  AlertTriangle,
  Shield,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Kullanıcılar', href: '/admin/users' },
  { icon: Package, label: 'Eşyalar', href: '/admin/items' },
  { icon: Heart, label: 'Eşleşmeler', href: '/admin/matches' },
  { icon: MessageSquare, label: 'Mesajlar', href: '/admin/messages' },
  { icon: AlertTriangle, label: 'Şikayetler', href: '/admin/reports' },
  { icon: Shield, label: 'Engellemeler', href: '/admin/blocks' },
  { icon: Settings, label: 'Ayarlar', href: '/admin/settings' },
  { icon: FileText, label: 'Politikalar', href: '/admin/policies' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const run = async () => {
      try {
        const auth = await import('@supabase/supabase-js')
        const { createClient } = auth
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) {
          setAllowed(false)
          setError('Önce giriş yapın')
          return
        }
        const res = await fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
        setAllowed(res.ok)
        if (!res.ok) {
          const j = await res.json().catch(()=>({}))
          setError(j?.error || 'Yetkisiz')
        }
      } catch (e: any) {
        setAllowed(false)
        setError(e?.message || 'Hata')
      }
    }
    run()
  }, [])

  const handleLogout = async () => {
    const auth = await import('@supabase/supabase-js')
    const { createClient } = auth
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Erişim Reddedildi</h1>
          <p className="text-gray-400 mb-6">{error || 'Bu sayfaya erişim yetkiniz yok.'}</p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-pink-500/50 transition-all"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                TakasYap
              </h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-400">Yönetici</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400 hover:text-red-300"
              title="Çıkış Yap"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:block fixed left-0 top-16 bottom-0 bg-black/20 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-40">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-0 bottom-0 w-64 bg-black/40 backdrop-blur-xl border-r border-white/10">
              <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  )
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
          }`}
        >
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}


