'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Filter, Package, RefreshCw } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getFeedItems, getUserItems } from '@/lib/api'
import type { Item } from '@/types'
import { loadSeekingPreferencesAsync, saveSeekingPreferencesAsync } from '@/lib/preferences'
import { filterAndRank, suggestPackages } from '@/lib/matching'
import DesktopLayout from '@/components/DesktopLayout'
import { useDeviceType } from '@/hooks/useDeviceType'
import { useTranslation } from 'react-i18next'

type DbCategory = 'clothing'|'toys'|'electronics'|'books'|'sports'|'home'|'other'

export default function MatchesPage() {
  const { t } = useTranslation('matches')
  const { isMobile } = useDeviceType()
  const [user, setUser] = useState<any>(null)
  const [feed, setFeed] = useState<Item[]>([])
  const [myItems, setMyItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)

  // Prefs state
  const [categories, setCategories] = useState<DbCategory[]>([])
  const [valueMin, setValueMin] = useState<string>('')
  const [valueMax, setValueMax] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [clothSize, setClothSize] = useState<'XS'|'S'|'M'|'L'|'XL'|'XXL'|''>('')
  const [clothColor, setClothColor] = useState<string>('')
  const [selectedOfferId, setSelectedOfferId] = useState<string>('')

  // Load user & prefs
  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const u = await getCurrentUser()
        setUser(u)
  const prefs = await loadSeekingPreferencesAsync()
        if (prefs) {
          setCategories(prefs.categories || [])
          setValueMin(prefs.valueMin?.toString() || '')
          setValueMax(prefs.valueMax?.toString() || '')
          setCity(prefs.locationCity || '')
          const c = prefs.filters?.clothing as any
          if (c) {
            if (c.sizeText) setClothSize(c.sizeText)
            if (c.color?.length) setClothColor(c.color.join(', '))
          }
        }
      } catch (e:any) {
        setError(e?.message || t('error'))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Load items
  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const feedItems = await getFeedItems(user?.id)
        const converted: Item[] = feedItems.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          images: item.images,
          category: item.category as any,
          condition: item.condition as any,
          estimatedValue: item.estimated_value || 0,
          color: [],
          ownerId: item.owner_id,
          owner: {
            id: item.owner_id,
            name: 'User',
            email: 'user@example.com',
            avatar: '/icons/icon-192.png',
            rating: 5,
            totalTrades: 0,
            joinedAt: new Date(),
            preferences: { categories: [], maxDistance: 50, ageRange: { min: 0, max: 100 } },
            location: { city: 'İstanbul', country: 'TR' }
          },
          location: { city: 'İstanbul', country: 'TR' },
          createdAt: new Date(item.created_at),
          isActive: item.status === 'active',
          tags: []
        }))
        setFeed(converted)
        if (user?.id) {
          const mine = await getUserItems(user.id)
          const mineConverted: Item[] = (mine || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            images: item.images,
            category: item.category as any,
            condition: item.condition as any,
            estimatedValue: item.estimated_value || 0,
            color: [],
            ownerId: item.owner_id,
            owner: {
              id: item.owner_id,
              name: 'Me',
              email: 'me@example.com',
              avatar: '/icons/icon-192.png',
              rating: 5,
              totalTrades: 0,
              joinedAt: new Date(),
              preferences: { categories: [], maxDistance: 50, ageRange: { min: 0, max: 100 } },
              location: { city: 'İstanbul', country: 'TR' }
            },
            location: { city: 'İstanbul', country: 'TR' },
            createdAt: new Date(item.created_at),
            isActive: item.status === 'active',
            tags: []
          }))
          setMyItems(mineConverted)
        } else {
          setMyItems([])
        }
      } catch (e:any) {
        setError(e?.message || t('loadError'))
      } finally {
        setLoading(false)
      }
    })()
  }, [user?.id])

  const ranked = useMemo(() => {
    const prefs: any = {
      categories,
      valueMin: valueMin ? Number(valueMin) : undefined,
      valueMax: valueMax ? Number(valueMax) : undefined,
      locationCity: city || undefined,
      filters: clothSize || clothColor ? {
        clothing: {
          sizeText: clothSize || undefined,
          color: clothColor ? clothColor.split(',').map(s => s.trim()).filter(Boolean) : undefined
        }
      } : undefined
    }
    if (!categories.length) return feed
    const scored = filterAndRank(feed, prefs, 50)
    return scored.map(s => s.item)
  }, [feed, categories, valueMin, valueMax, city, clothSize, clothColor])

  const offer = useMemo(() => myItems.find(i => i.id === selectedOfferId), [myItems, selectedOfferId])
  const packages = useMemo(() => {
    if (!offer || !offer.estimatedValue) return []
    return suggestPackages(offer.estimatedValue, ranked)
  }, [offer, ranked])

  const toggleCategory = (ct: DbCategory) => {
    setCategories(prev => prev.includes(ct) ? prev.filter(c => c !== ct) : [...prev, ct])
  }

  const savePrefs = () => {
    const filters: any = {}
    if (clothSize || clothColor) {
      filters.clothing = {
        sizeText: clothSize || undefined,
        color: clothColor ? clothColor.split(',').map(s => s.trim()).filter(Boolean) : undefined
      }
    }
    saveSeekingPreferencesAsync({
      categories,
      valueMin: valueMin ? Number(valueMin) : undefined,
      valueMax: valueMax ? Number(valueMax) : undefined,
      locationCity: city || undefined,
      filters
    } as any)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">{t('loading')}</p>
    </div>
  </div>

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">{t('loginRequired')}</h2>
          <Link href="/login" className="inline-block mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg">{t('loginButton')}</Link>
        </div>
      </div>
    )
  }

  // Preferences Panel Component
  const PreferencesPanel = ({ className = '' }: { className?: string }) => (
    <div className={`bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 ${className}`}>
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Filter className="w-5 h-5" />
        {t('preferences')}
      </h3>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {(['clothing','toys','electronics','books','sports','home','other'] as const).map(ct => (
          <button key={ct} type="button" onClick={() => toggleCategory(ct)}
            className={`py-2 px-3 rounded-lg border-2 text-xs transition-all ${categories.includes(ct)?'border-purple-500 bg-purple-50 text-purple-700':'border-gray-200 hover:border-purple-300'}`}>{ct}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">{t('minValue')}</label>
          <input value={valueMin} onChange={e=>setValueMin(e.target.value)} type="number" className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm mb-1">{t('maxValue')}</label>
          <input value={valueMax} onChange={e=>setValueMax(e.target.value)} type="number" className="w-full px-3 py-2 border rounded-lg" />
        </div>
      </div>
      <div className="mt-3">
        <label className="block text-sm mb-1">{t('city')}</label>
        <input value={city} onChange={e=>setCity(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder={t('cityPlaceholder')} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1">{t('clothingSize')}</label>
          <select value={clothSize} onChange={e=>setClothSize(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg">
            <option value="">—</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">{t('clothingColor')}</label>
          <input value={clothColor} onChange={e=>setClothColor(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder={t('colorPlaceholder')} />
        </div>
      </div>
      <div className="mt-3 text-right">
        <button onClick={savePrefs} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">{t('savePreferences')}</button>
      </div>
    </div>
  )

  // Matched Items Grid Component
  const MatchedItemsGrid = ({ columns = 2 }: { columns?: number }) => (
    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Package className="w-5 h-5" />
        {t('matchedItems')} ({ranked.length})
      </h3>
      <div className={`grid gap-3 ${columns === 4 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2'}`}>
        {ranked.map(it => (
          <div key={it.id} className="bg-white rounded-lg border p-2 hover:shadow-md transition-shadow">
            <div className="relative w-full aspect-square rounded overflow-hidden mb-2">
              {it.images?.[0] ? (
                <Image src={it.images[0]} alt={it.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
            <div className="text-sm font-medium line-clamp-2">{it.title}</div>
            <div className="text-xs text-gray-500">₺{it.estimatedValue || 0}</div>
          </div>
        ))}
      </div>
      {!ranked.length && (
        <p className="text-sm text-gray-600 text-center py-8">{t('noMatches')}</p>
      )}
    </div>
  )

  // Cross-trade Packages Component
  const CrossTradePackages = () => (
    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <RefreshCw className="w-5 h-5" />
        {t('crossTradePackages')}
      </h3>
      {myItems.length ? (
        <div className="mb-3">
          <label className="block text-sm mb-1">{t('selectYourItem')}</label>
          <select value={selectedOfferId} onChange={e=>setSelectedOfferId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
            <option value="">{t('selectOption')}</option>
            {myItems.map(mi => (
              <option key={mi.id} value={mi.id}>{mi.title} — ₺{mi.estimatedValue || 0}</option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-2">{t('uploadItemFirst')}</p>
      )}

      {offer && packages.length > 0 ? (
        <div className="space-y-3">
          {packages.map((p, idx) => (
            <div key={idx} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{t('packageNumber', { number: idx+1 })}</div>
                <div className="text-xs text-gray-600">{t('packageTotal', { total: p.total, diff: Math.abs((offer?.estimatedValue||0)-p.total) })}</div>
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {p.items.map(it => (<li key={it.id}>{it.title} — ₺{it.estimatedValue||0}</li>))}
              </ul>
            </div>
          ))}
        </div>
      ) : offer ? (
        <p className="text-sm text-gray-600">{t('noPackages')}</p>
      ) : null}
    </div>
  )

  // Desktop görünüm
  if (!isMobile) {
    return (
      <DesktopLayout title={t('title')} maxWidth="7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sol Panel - Tercihler */}
          <div className="lg:col-span-1 space-y-4">
            <PreferencesPanel />
            <CrossTradePackages />
          </div>
          
          {/* Sağ Panel - Eşleşen Ürünler */}
          <div className="lg:col-span-3">
            <MatchedItemsGrid columns={4} />
          </div>
        </div>
      </DesktopLayout>
    )
  }

  // Mobil görünüm

  // Mobil görünüm

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-pink-50 via-purple-50 to-indigo-50 flex flex-col">
      <header className="shrink-0 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{t('title')}</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overscroll-contain max-w-md mx-auto p-4 pb-24 space-y-6">
        <PreferencesPanel />
        <MatchedItemsGrid columns={2} />
        <CrossTradePackages />
      </main>
    </div>
  )
}
