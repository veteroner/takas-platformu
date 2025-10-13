'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUser } from '@/lib/auth'
import { getFeedItems, getUserItems } from '@/lib/api'
import type { Item } from '@/types'
import { loadSeekingPreferencesAsync, saveSeekingPreferencesAsync } from '@/lib/preferences'
import { filterAndRank, suggestPackages } from '@/lib/matching'

type DbCategory = 'clothing'|'toys'|'electronics'|'books'|'sports'|'home'|'other'

export default function MatchesPage() {
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
        setError(e?.message || 'Bir hata oluştu')
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
        setError(e?.message || 'Yükleme hatası')
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Eşleşmeleri görmek için giriş yap</h2>
          <Link href="/login" className="inline-block mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg">Giriş</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 pt-safe">
        <div className="max-w-md mx-auto px-4 py-4 pt-12 md:pt-4 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Sana Uygun Eşleşmeler</h1>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">Ana sayfa</Link>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-24 space-y-6">
        {/* Prefs */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">🎯 Tercihler</h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(['clothing','toys','electronics','books','sports','home','other'] as const).map(ct => (
              <button key={ct} type="button" onClick={() => toggleCategory(ct)}
                className={`py-2 px-3 rounded-lg border-2 text-xs transition-all ${categories.includes(ct)?'border-purple-500 bg-purple-50 text-purple-700':'border-gray-200 hover:border-purple-300'}`}>{ct}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Min ₺</label>
              <input value={valueMin} onChange={e=>setValueMin(e.target.value)} type="number" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm mb-1">Max ₺</label>
              <input value={valueMax} onChange={e=>setValueMax(e.target.value)} type="number" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm mb-1">Şehir</label>
            <input value={city} onChange={e=>setCity(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="İstanbul" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1">Giyim Beden (Text)</label>
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
              <label className="block text-xs mb-1">Giyim Renk(ler)</label>
              <input value={clothColor} onChange={e=>setClothColor(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Kırmızı, Siyah" />
            </div>
          </div>
          <div className="mt-3 text-right">
            <button onClick={savePrefs} className="bg-purple-600 text-white px-4 py-2 rounded-lg">Kaydet</button>
          </div>
        </div>

        {/* Ranked list */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">🔎 Eşleşen Ürünler</h3>
          <div className="grid grid-cols-2 gap-3">
            {ranked.map(it => (
              <div key={it.id} className="bg-white rounded-lg border p-2">
                <div className="relative w-full aspect-square rounded overflow-hidden mb-2">
                  {it.images?.[0] ? (
                    <Image src={it.images[0]} alt={it.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <div className="text-sm font-medium line-clamp-2">{it.title}</div>
                <div className="text-xs text-gray-500">₺{it.estimatedValue || 0}</div>
              </div>
            ))}
          </div>
          {!ranked.length && (
            <p className="text-sm text-gray-600">Tercihlerine uyan ürün bulunamadı. Kategorileri genişletmeyi dene.</p>
          )}
        </div>

        {/* Cross-trade packages */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">🔄 Çapraz Takas Paket Önerileri</h3>
          {myItems.length ? (
            <div className="mb-3">
              <label className="block text-sm mb-1">Vermek İstediğin Ürünün</label>
              <select value={selectedOfferId} onChange={e=>setSelectedOfferId(e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                <option value="">Seçiniz</option>
                {myItems.map(mi => (
                  <option key={mi.id} value={mi.id}>{mi.title} — ₺{mi.estimatedValue || 0}</option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mb-2">Önce bir ürün yükleyerek çapraz takas paketlerini görebilirsin.</p>
          )}

          {offer && packages.length > 0 ? (
            <div className="space-y-3">
              {packages.map((p, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Paket #{idx+1}</div>
                    <div className="text-xs text-gray-600">Toplam: ₺{p.total} • Fark: ₺{Math.abs((offer?.estimatedValue||0)-p.total)}</div>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {p.items.map(it => (<li key={it.id}>{it.title} — ₺{it.estimatedValue||0}</li>))}
                  </ul>
                </div>
              ))}
            </div>
          ) : offer ? (
            <p className="text-sm text-gray-600">Uygun paket önerisi bulunamadı. Toleransı artırmayı veya kategorileri genişletmeyi deneyin.</p>
          ) : null}
        </div>
      </main>
    </div>
  )
}
