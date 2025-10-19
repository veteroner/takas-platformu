'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Edit2, Trash2, Package, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ItemCondition } from '@/types'

interface UserItem {
  id: string
  title: string
  description: string
  category: string
  condition: string
  estimated_value: number
  images: string[]
  status: 'active' | 'inactive' | 'traded'
  created_at: string
}

export default function MyItemsPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [items, setItems] = useState<UserItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<UserItem | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    loadUserItems()
  }, [])

  const loadUserItems = async () => {
    try {
      setIsLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      setUserId(user.id)

      // Load user's items
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setItems(data || [])
    } catch (error) {
      console.error('Error loading items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item: UserItem) => {
    setEditingItem(item)
    setShowEditModal(true)
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItems(items.filter(item => item.id !== itemId))
      alert('Ürün başarıyla silindi!')
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Ürün silinirken bir hata oluştu')
    }
  }

  const handleToggleStatus = async (item: UserItem) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active'

    try {
      const { error } = await supabase
        .from('items')
        .update({ status: newStatus })
        .eq('id', item.id)

      if (error) throw error

      setItems(items.map(i => 
        i.id === item.id ? { ...i, status: newStatus } : i
      ))
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Durum güncellenirken bir hata oluştu')
    }
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    try {
      const { error } = await supabase
        .from('items')
        .update({
          title: editingItem.title,
          description: editingItem.description,
          category: editingItem.category,
          condition: editingItem.condition,
          estimated_value: editingItem.estimated_value
        })
        .eq('id', editingItem.id)

      if (error) throw error

      setItems(items.map(i => 
        i.id === editingItem.id ? editingItem : i
      ))
      
      setShowEditModal(false)
      setEditingItem(null)
      alert('Ürün başarıyla güncellendi!')
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Ürün güncellenirken bir hata oluştu')
    }
  }

  const getConditionText = (condition: string) => {
    const map: Record<string, string> = {
      'new': 'Sıfır',
      'like-new': 'Sıfır Gibi',
      'like_new': 'Sıfır Gibi',
      'good': 'İyi',
      'fair': 'Orta',
      'poor': 'Kötü'
    }
    return map[condition] || condition
  }

  const getCategoryText = (category: string) => {
    const map: Record<string, string> = {
      'clothing': '👕 Giyim',
      'toys': '🧸 Oyuncak',
      'electronics': '📱 Elektronik',
      'books': '📚 Kitap',
      'sports': '⚽ Spor',
      'home': '🏠 Ev Eşyası',
      'other': '🔧 Diğer'
    }
    return map[category] || category
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
        <div className="max-w-4xl mx-auto px-4 py-4 pt-12 md:pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Ürünlerim
            </h1>
          </div>
          <Link
            href="/upload"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            + Yeni Ürün
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Henüz ürün eklemediniz
            </h2>
            <p className="text-gray-600 mb-6">
              İlk ürününüzü ekleyerek takas yapmaya başlayın!
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Ürün Ekle
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-100 to-purple-100">
                    {item.images && item.images.length > 0 ? (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-pink-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        item.status === 'active' 
                          ? 'bg-green-500 text-white'
                          : item.status === 'traded'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {item.status === 'active' ? '✓ Aktif' : 
                         item.status === 'traded' ? '🤝 Takas Edildi' : 
                         '⏸ Pasif'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-gray-700 mb-3">
                      <span>👕 {getCategoryText(item.category)}</span>
                      <span>•</span>
                      <span>🔧 {getConditionText(item.condition)}</span>
                      <span>•</span>
                      <span className="font-bold text-green-600">
                        ≈₺{item.estimated_value || 0}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className="flex items-center gap-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                        title={item.status === 'active' ? 'Pasif yap' : 'Aktif yap'}
                      >
                        {item.status === 'active' ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Pasif Yap
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Aktif Yap
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Düzenle
                      </button>
                      
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Ürünü Düzenle
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Kategori
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="clothing">👕 Giyim</option>
                    <option value="toys">🧸 Oyuncak</option>
                    <option value="electronics">📱 Elektronik</option>
                    <option value="books">📚 Kitap</option>
                    <option value="sports">⚽ Spor</option>
                    <option value="home">🏠 Ev Eşyası</option>
                    <option value="other">🔧 Diğer</option>
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Durumu
                  </label>
                  <select
                    value={editingItem.condition}
                    onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="new">Sıfır</option>
                    <option value="like-new">Sıfır Gibi</option>
                    <option value="like_new">Sıfır Gibi</option>
                    <option value="good">İyi</option>
                    <option value="fair">Orta</option>
                    <option value="poor">Kötü</option>
                  </select>
                </div>

                {/* Estimated Value */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Tahmini Değer (₺)
                  </label>
                  <input
                    type="number"
                    value={editingItem.estimated_value}
                    onChange={(e) => setEditingItem({ ...editingItem, estimated_value: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingItem(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-md"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
