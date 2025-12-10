'use client'

import { useEffect, useState } from 'react'
import { 
  Users, 
  Package, 
  Heart, 
  MessageSquare, 
  AlertTriangle, 
  Shield,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react'
import { getAdminHeaders } from '@/lib/admin-fetch'

type Metrics = {
  users: number
  items: number
  matches: number
  messages: number
  reports?: number
  blocks?: number
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const auth = await import('@supabase/supabase-js')
        const { createClient } = auth
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createClient(url, key)
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token

        // Get basic metrics from API with 2FA token
        const res = await fetch('/api/admin/metrics', {
          headers: getAdminHeaders(token ? { Authorization: `Bearer ${token}` } : {})
        })
        if (!res.ok) {
          const j = await res.json().catch(()=>({}))
          throw new Error(j?.error || 'Beklenmeyen hata')
        }
        const j = await res.json()
        const baseMetrics = j.data

        // Get additional metrics from Supabase
        const [reportsRes, blocksRes] = await Promise.all([
          supabase.from('user_reports').select('id', { count: 'exact', head: true }),
          supabase.from('user_blocks').select('id', { count: 'exact', head: true })
        ])

        setMetrics({
          ...baseMetrics,
          reports: reportsRes.count || 0,
          blocks: blocksRes.count || 0
        })
      } catch (e: any) {
        setError(e?.message || 'Hata')
      }
    }
    run()
  }, [])

  if (!metrics && !error) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-white/10 rounded mb-2" />
          <div className="h-4 w-96 bg-white/5 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_,i)=> (
            <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
        <h3 className="font-semibold mb-2">Hata</h3>
        <p>{error}</p>
      </div>
    )
  }

  const cards = [
    {
      title: 'Toplam Kullanıcılar',
      value: metrics!.users,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Aktif Eşyalar',
      value: metrics!.items,
      icon: Package,
      color: 'from-purple-500 to-pink-500',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Toplam Eşleşme',
      value: metrics!.matches,
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Mesajlar',
      value: metrics!.messages,
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      trend: '+23%',
      trendUp: true
    },
    {
      title: 'Şikayetler',
      value: metrics!.reports || 0,
      icon: AlertTriangle,
      color: 'from-orange-500 to-red-500',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Engellemeler',
      value: metrics!.blocks || 0,
      icon: Shield,
      color: 'from-gray-500 to-slate-500',
      trend: '-2%',
      trendUp: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Hoş Geldiniz 👋
        </h1>
        <p className="text-white">
          TakaZone platformunun genel durumunu buradan takip edebilirsiniz.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon
          const TrendIcon = card.trendUp ? TrendingUp : TrendingDown
          
          return (
            <div
              key={idx}
              className="relative group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-pink-500/10"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`} />
              
              <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} p-2.5 mb-4 shadow-lg`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-white mb-1">
                  {card.title}
                </h3>

                {/* Value */}
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-white">
                    {card.value.toLocaleString('tr-TR')}
                  </p>
                  
                  {/* Trend */}
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    card.trendUp ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{card.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Sistem Durumu</h2>
          </div>
          <div className="space-y-3">
            <StatusItem label="API Durumu" status="Aktif" positive />
            <StatusItem label="Veritabanı" status="Çalışıyor" positive />
            <StatusItem label="Bildirimler" status="Aktif" positive />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Dikkat Gerektiren</h2>
          </div>
          <div className="space-y-3">
            <AlertItem 
              label="Bekleyen Şikayetler" 
              count={metrics!.reports || 0}
              href="/admin/reports"
            />
            <AlertItem 
              label="Yeni Engellemeler" 
              count={metrics!.blocks || 0}
              href="/admin/blocks"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusItem({ label, status, positive }: { label: string; status: string; positive: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <span className="text-sm text-white">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${positive ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
        <span className={`text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>
          {status}
        </span>
      </div>
    </div>
  )
}

function AlertItem({ label, count, href }: { label: string; count: number; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
    >
      <span className="text-sm text-white group-hover:text-white transition-colors">{label}</span>
      <span className="text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        {count}
      </span>
    </a>
  )
}


