'use client'

import { useEffect, useState } from 'react'
import { Shield, Flag, Trash2, CheckCircle, XCircle, AlertTriangle, Package } from 'lucide-react'
import { getAdminHeaders } from '@/lib/admin-fetch'
import { toast } from 'sonner'
import Image from 'next/image'

type ProductReport = {
  id: string
  product_id: string
  reporter_id: string
  report_type: string
  description: string | null
  status: 'pending' | 'auto_removed' | 'dismissed'
  created_at: string
  auto_removed_at: string | null
  product?: {
    title: string
    description: string
    status: string
    image_url: string | null
  }
  reporter?: {
    full_name: string
    email: string
  }
}

type FilterStatus = 'all' | 'pending' | 'auto_removed' | 'dismissed'

const REPORT_TYPE_LABELS: Record<string, string> = {
  inappropriate_content: '❌ Uygunsuz İçerik',
  illegal_item: '⚠️ Yasadışı Ürün',
  scam: '💸 Dolandırıcılık',
  fake_item: '🎭 Sahte Ürün',
  spam: '📧 Spam',
  other: '🔹 Diğer'
}

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Beklemede',
  auto_removed: '🤖 Otomatik Kaldırıldı',
  dismissed: '✅ Reddedildi'
}

export default function AdminModerationPage() {
  const [reports, setReports] = useState<ProductReport[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/admin/moderation/reports', {
        headers: getAdminHeaders(token ? { Authorization: `Bearer ${token}` } : {})
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Veriler yüklenemedi')
      }

      const data = await res.json()
      setReports(data.reports || [])
    } catch (error) {
      console.error('Load reports error:', error)
      toast.error(error instanceof Error ? error.message : 'Raporlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = async (reportId: string) => {
    if (!confirm('Bu şikayeti reddetmek istediğinizden emin misiniz?')) return

    try {
      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/admin/moderation/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ reportId, action: 'dismiss' })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'İşlem başarısız')
      }

      toast.success('Şikayet reddedildi')
      loadReports()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
    }
  }

  const handleRemoveProduct = async (reportId: string, productId: string) => {
    if (!confirm('Bu ürünü manuel olarak kaldırmak istediğinizden emin misiniz?')) return

    try {
      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/admin/moderation/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ reportId, productId, action: 'remove' })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'İşlem başarısız')
      }

      toast.success('Ürün kaldırıldı')
      loadReports()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
    }
  }

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter)

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    auto_removed: reports.filter(r => r.status === 'auto_removed').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Ürün Moderasyonu</h1>
        </div>
        <p className="text-gray-600">Kullanıcı şikayetlerini inceleyin ve yönetin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Toplam</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Flag className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Bekleyen</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Kaldırılan</p>
              <p className="text-2xl font-bold text-red-900">{stats.auto_removed}</p>
            </div>
            <Trash2 className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Reddedilen</p>
              <p className="text-2xl font-bold text-green-900">{stats.dismissed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'auto_removed', 'dismissed'] as FilterStatus[]).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? '📋 Tümü' : STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Şikayet bulunmuyor</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter === 'all' 
                ? 'Henüz hiç şikayet yapılmamış'
                : `"${STATUS_LABELS[filter]}" durumunda şikayet yok`}
            </p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {report.product?.image_url ? (
                    <Image 
                      src={report.product.image_url} 
                      alt={report.product.title}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Report Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {report.product?.title || 'Ürün Bulunamadı'}
                      </h3>
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded font-medium">
                          {REPORT_TYPE_LABELS[report.report_type]}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded font-medium ${
                          report.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700'
                            : report.status === 'auto_removed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {STATUS_LABELS[report.status]}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {report.description && (
                    <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded">
                      &ldquo;{report.description}&rdquo;
                    </p>
                  )}

                  <div className="text-sm text-gray-600 mb-3">
                    <p><strong>Şikayet Eden:</strong> {report.reporter?.full_name || 'Bilinmiyor'} ({report.reporter?.email || 'N/A'})</p>
                    <p><strong>Ürün Durumu:</strong> {report.product?.status || 'N/A'}</p>
                  </div>

                  {/* Actions */}
                  {report.status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => handleRemoveProduct(report.id, report.product_id)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Ürünü Kaldır
                      </button>
                      <button
                        onClick={() => handleDismiss(report.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Şikayeti Reddet
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
