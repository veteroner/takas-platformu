'use client'

import { useEffect, useState } from 'react'
import { Trash2, Package, AlertTriangle, RotateCcw, Eye } from 'lucide-react'
import { getAdminHeaders } from '@/lib/admin-fetch'
import { toast } from 'sonner'
import Image from 'next/image'

type RemovedProduct = {
  id: string
  product_id: string
  product_owner_id: string
  removal_reason: 'auto_threshold' | 'illegal_content' | 'admin_action' | 'user_request'
  report_count: number
  removed_at: string
  product_data: {
    title: string
    description: string
    category: string
    image_url: string | null
    condition: string
  }
  restored_at: string | null
  restoration_reason: string | null
  owner?: {
    full_name: string
    email: string
  }
}

const REMOVAL_REASON_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  auto_threshold: { 
    label: 'Otomatik Threshold (3+ Şikayet)', 
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: '🤖'
  },
  illegal_content: { 
    label: 'Yasadışı İçerik Filtresi', 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: '⚠️'
  },
  admin_action: { 
    label: 'Admin Müdahalesi', 
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: '👤'
  },
  user_request: { 
    label: 'Kullanıcı İsteği', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '📝'
  }
}

export default function RemovedProductsPage() {
  const [products, setProducts] = useState<RemovedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showRestored, setShowRestored] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<RemovedProduct | null>(null)

  useEffect(() => {
    loadRemovedProducts()
  }, [])

  const loadRemovedProducts = async () => {
    setLoading(true)
    try {
      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/admin/moderation/removed-products', {
        headers: getAdminHeaders(token ? { Authorization: `Bearer ${token}` } : {})
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Veriler yüklenemedi')
      }

      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Load removed products error:', error)
      toast.error(error instanceof Error ? error.message : 'Kaldırılan ürünler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (logId: string, productId: string) => {
    const reason = prompt('Geri yükleme nedeni (opsiyonel):')
    if (reason === null) return // Cancel

    try {
      const auth = await import('@supabase/supabase-js')
      const { createClient } = auth
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const supabase = createClient(url, key)
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/admin/moderation/removed-products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminHeaders(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          logId, 
          productId, 
          action: 'restore',
          reason: reason || undefined 
        })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'İşlem başarısız')
      }

      toast.success('Ürün geri yüklendi')
      loadRemovedProducts()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu')
    }
  }

  const filteredProducts = showRestored 
    ? products 
    : products.filter(p => !p.restored_at)

  const stats = {
    total: products.length,
    active: products.filter(p => !p.restored_at).length,
    restored: products.filter(p => p.restored_at).length,
    byReason: {
      auto_threshold: products.filter(p => p.removal_reason === 'auto_threshold' && !p.restored_at).length,
      illegal_content: products.filter(p => p.removal_reason === 'illegal_content' && !p.restored_at).length,
      admin_action: products.filter(p => p.removal_reason === 'admin_action' && !p.restored_at).length,
      user_request: products.filter(p => p.removal_reason === 'user_request' && !p.restored_at).length,
    }
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
          <Trash2 className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-bold">Kaldırılan Ürünler</h1>
        </div>
        <p className="text-gray-600">Sistemden kaldırılan ürünlerin geçmişi ve detayları</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Toplam Kaldırılan</p>
              <p className="text-2xl font-bold text-red-900">{stats.total}</p>
            </div>
            <Trash2 className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Aktif Kaldırılmış</p>
              <p className="text-2xl font-bold text-orange-900">{stats.active}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Geri Yüklenen</p>
              <p className="text-2xl font-bold text-green-900">{stats.restored}</p>
            </div>
            <RotateCcw className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Reason Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Kaldırma Nedenleri (Aktif)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.byReason).map(([reason, count]) => {
            const info = REMOVAL_REASON_LABELS[reason as keyof typeof REMOVAL_REASON_LABELS]
            return (
              <div key={reason} className="text-center">
                <div className="text-3xl mb-1">{info.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-600 mt-1">{info.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRestored}
              onChange={(e) => setShowRestored(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Geri yüklenen ürünleri göster
            </span>
          </label>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">Kaldırılmış ürün bulunmuyor</p>
            <p className="text-gray-500 text-sm mt-2">
              {showRestored 
                ? 'Henüz hiç ürün kaldırılmamış'
                : 'Aktif kaldırılmış ürün yok (Geri yüklenenleri görmek için filtreyi açın)'}
            </p>
          </div>
        ) : (
          filteredProducts.map(product => {
            const reasonInfo = REMOVAL_REASON_LABELS[product.removal_reason]
            return (
              <div 
                key={product.id}
                className={`bg-white rounded-lg border p-6 transition-all ${
                  product.restored_at 
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {product.product_data?.image_url ? (
                      <Image 
                        src={product.product_data.image_url} 
                        alt={product.product_data.title}
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

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {product.product_data?.title || 'Ürün Bilgisi Yok'}
                        </h3>
                        <div className="flex gap-2 items-center flex-wrap">
                          <span className={`text-sm px-3 py-1 rounded border font-medium ${reasonInfo.color}`}>
                            {reasonInfo.icon} {reasonInfo.label}
                          </span>
                          {product.restored_at && (
                            <span className="text-sm px-3 py-1 rounded border bg-green-100 text-green-700 border-green-200 font-medium">
                              ✅ Geri Yüklendi
                            </span>
                          )}
                          {product.report_count > 0 && (
                            <span className="text-sm px-2 py-1 bg-red-50 text-red-600 rounded">
                              {product.report_count} şikayet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {product.product_data?.description && (
                      <p className="text-gray-700 mb-3 text-sm line-clamp-2">
                        {product.product_data.description}
                      </p>
                    )}

                    <div className="text-sm text-gray-600 mb-3 grid grid-cols-2 gap-2">
                      <p><strong>Kategori:</strong> {product.product_data?.category || 'N/A'}</p>
                      <p><strong>Durum:</strong> {product.product_data?.condition || 'N/A'}</p>
                      <p><strong>Sahip:</strong> {product.owner?.full_name || 'Bilinmiyor'}</p>
                      <p><strong>Email:</strong> {product.owner?.email || 'N/A'}</p>
                      <p><strong>Kaldırıldı:</strong> {new Date(product.removed_at).toLocaleDateString('tr-TR')}</p>
                      {product.restored_at && (
                        <p><strong>Geri Yüklendi:</strong> {new Date(product.restored_at).toLocaleDateString('tr-TR')}</p>
                      )}
                    </div>

                    {product.restoration_reason && (
                      <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                        <p className="text-sm text-green-800">
                          <strong>Geri Yükleme Nedeni:</strong> {product.restoration_reason}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    {!product.restored_at && (
                      <div className="flex gap-2 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => handleRestore(product.id, product.product_id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Geri Yükle
                        </button>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Detayları Gör
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Ürün Detayları (JSON)</h3>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
              {JSON.stringify(selectedProduct.product_data, null, 2)}
            </pre>
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 w-full"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
