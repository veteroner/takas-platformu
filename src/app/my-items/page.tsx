'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Edit2, Trash2, Package, Eye, EyeOff, Plus, Grid, List } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ItemCondition } from '@/types'
import DesktopLayout from '@/components/DesktopLayout'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useTranslation } from 'react-i18next'

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
  const { isMobile } = useDeviceType()
  const { t } = useTranslation('my-items')
  const [userId, setUserId] = useState<string | null>(null)
  const [items, setItems] = useState<UserItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<UserItem | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
    if (!confirm(t('deleteConfirm'))) return

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      setItems(items.filter(item => item.id !== itemId))
      alert(t('deleteSuccess'))
    } catch (error) {
      console.error('Error deleting item:', error)
      alert(t('deleteError'))
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
      alert(t('statusUpdateError'))
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
      alert(t('updateSuccess'))
    } catch (error) {
      console.error('Error updating item:', error)
      alert(t('updateError'))
    }
  }

  const getConditionText = (condition: string) => {
    const conditionKey = condition.replace('-', '_')
    return t(`conditions.${conditionKey}`, condition)
  }

  const getCategoryText = (category: string) => {
    return t(`categories.${category}`, category)
  }

  // Item Card Component
  const ItemCard = ({ item, isGridView = false }: { item: UserItem; isGridView?: boolean }) => {
    if (isGridView) {
      return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group">
          {/* Image */}
          <div className="relative aspect-square bg-linear-to-br from-pink-100 to-purple-100">
            {item.images && item.images.length > 0 ? (
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-12 h-12 text-pink-300" />
              </div>
            )}
            {/* Status Badge */}
            <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
              item.status === 'active' 
                ? 'bg-green-500 text-white'
                : item.status === 'traded'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {item.status === 'active' ? `✓ ${t('statusActive')}` : 
               item.status === 'traded' ? `🤝 ${t('statusTraded')}` : 
               `⏸ ${t('statusInactive')}`}
            </span>
            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => handleToggleStatus(item)}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title={item.status === 'active' ? t('makeInactive') : t('makeActive')}
              >
                {item.status === 'active' ? <EyeOff className="w-5 h-5 text-gray-700" /> : <Eye className="w-5 h-5 text-gray-700" />}
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <Edit2 className="w-5 h-5 text-blue-500" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
          {/* Info */}
          <div className="p-3">
            <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-gray-600">{getCategoryText(item.category)}</span>
              <span className="font-bold text-green-600">≈₺{item.estimated_value || 0}</span>
            </div>
          </div>
        </div>
      )
    }

    // List view (original)
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-linear-to-br from-pink-100 to-purple-100">
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
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              </div>
              
              {/* Status Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                item.status === 'active' 
                  ? 'bg-green-500 text-white'
                  : item.status === 'traded'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}>
                {item.status === 'active' ? `✓ ${t('statusActive')}` : 
                 item.status === 'traded' ? `🤝 ${t('statusTraded')}` : 
                 `⏸ ${t('statusInactive')}`}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium text-gray-700 mb-3">
              <span>👕 {getCategoryText(item.category)}</span>
              <span>•</span>
              <span>🔧 {getConditionText(item.condition)}</span>
              <span>•</span>
              <span className="font-bold text-green-600">≈₺{item.estimated_value || 0}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleStatus(item)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                {item.status === 'active' ? <><EyeOff className="w-4 h-4" /> {t('makeInactive')}</> : <><Eye className="w-4 h-4" /> {t('makeActive')}</>}
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Edit2 className="w-4 h-4" /> {t('edit')}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Trash2 className="w-4 h-4" /> {t('delete')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Edit Modal Component
  const EditModal = () => (
    showEditModal && editingItem && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('editItemTitle')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">{t('itemName')}</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">{t('description')}</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">{t('category')}</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="clothing">{t('categories.clothing')}</option>
                  <option value="toys">{t('categories.toys')}</option>
                  <option value="electronics">{t('categories.electronics')}</option>
                  <option value="books">{t('categories.books')}</option>
                  <option value="sports">{t('categories.sports')}</option>
                  <option value="home">{t('categories.home')}</option>
                  <option value="other">{t('categories.other')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">{t('condition')}</label>
                <select
                  value={editingItem.condition}
                  onChange={(e) => setEditingItem({ ...editingItem, condition: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="new">{t('conditions.new')}</option>
                  <option value="like-new">{t('conditions.like_new')}</option>
                  <option value="good">{t('conditions.good')}</option>
                  <option value="fair">{t('conditions.fair')}</option>
                  <option value="poor">{t('conditions.poor')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">{t('estimatedValue')}</label>
                <input
                  type="number"
                  value={editingItem.estimated_value}
                  onChange={(e) => setEditingItem({ ...editingItem, estimated_value: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-300 bg-white rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowEditModal(false); setEditingItem(null); }}
                className="flex-1 px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-md"
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  )

  // Desktop görünüm
  if (!isMobile) {
    return (
      <DesktopLayout title={t('title')} maxWidth="7xl">
        {/* Desktop Stats & Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
              <span className="text-gray-600">Toplam:</span>
              <span className="ml-2 font-bold text-purple-600">{items.length} ürün</span>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
              <span className="text-gray-600">{t('statusActive')}:</span>
              <span className="ml-2 font-bold text-green-600">{items.filter(i => i.status === 'active').length}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-white/80 backdrop-blur-md rounded-xl border border-white/20 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <Link
              href="/upload"
              className="flex items-center gap-2 bg-linear-to-r from-pink-500 to-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              {t('addItemButton')}
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-md rounded-2xl border border-white/20">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('noItems')}</h2>
            <p className="text-gray-600 mb-6">{t('noItemsDesc')}</p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-linear-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-5 h-5" /> {t('addItemButton')}
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => <ItemCard key={item.id} item={item} isGridView={true} />)}
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => <ItemCard key={item.id} item={item} isGridView={false} />)}
          </div>
        )}
        
        <EditModal />
      </DesktopLayout>
    )
  }

  // Mobil görünüm

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  // Mobil görünüm

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
        <div className="max-w-4xl mx-auto px-4 py-4 pt-12 md:pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {t('title')}
            </h1>
          </div>
          <Link
            href="/upload"
            className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            + {t('addItemButton')}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('noItems')}</h2>
            <p className="text-gray-600 mb-6">{t('noItemsDesc')}</p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-linear-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              {t('addItemButton')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => <ItemCard key={item.id} item={item} isGridView={false} />)}
          </div>
        )}
      </main>

      <EditModal />
    </div>
  )
}
