'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Baby, Ruler, MapPin, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { saveUserMatchingPreferences, getUserMatchingPreferences } from '@/lib/matchingService'
import DesktopLayout from '@/components/DesktopLayout'
import { useDeviceType } from '@/hooks/useDeviceType'
import type { ClothingSizeText, DbCategory, ChildInfo } from '@/types/matching'

const sizes: ClothingSizeText[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const categories: { value: DbCategory; label: string }[] = [
  { value: 'clothing', label: '👕 Giyim' },
  { value: 'toys', label: '🧸 Oyuncak' },
  { value: 'electronics', label: '📱 Elektronik' },
  { value: 'books', label: '📚 Kitap' },
  { value: 'sports', label: '⚽ Spor' },
  { value: 'home', label: '🏠 Ev Eşyası' },
]

const cities = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
  'Mersin', 'Diyarbakır', 'Kayseri', 'Eskişehir', 'Samsun', 'Denizli', 'Şanlıurfa'
]

export default function MatchingPreferencesPage() {
  const router = useRouter()
  const { isMobile } = useDeviceType()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [preferences, setPreferences] = useState({
    mySizeText: '' as ClothingSizeText | '',
    myGender: '' as 'male' | 'female' | '',
    hasChildren: false,
    childrenInfo: [] as ChildInfo[],
    preferredCategories: [] as DbCategory[],
    sizeTolerance: 1,
    seekingToyAgeMin: undefined as number | undefined,
    seekingToyAgeMax: undefined as number | undefined,
    preferredCity: '',
    maxDistanceKm: 50,
    acceptShipping: true,
    minConditionScore: 5
  })

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      // Mevcut tercihleri yükle
      const existingPrefs = await getUserMatchingPreferences(user.id)
      if (existingPrefs) {
        setPreferences({
          mySizeText: existingPrefs.mySizeText || '',
          myGender: existingPrefs.myGender || '',
          hasChildren: existingPrefs.hasChildren,
          childrenInfo: existingPrefs.childrenInfo || [],
          preferredCategories: existingPrefs.preferredCategories || [],
          sizeTolerance: existingPrefs.sizeTolerance ?? 1,
          seekingToyAgeMin: existingPrefs.seekingToyAgeMin,
          seekingToyAgeMax: existingPrefs.seekingToyAgeMax,
          preferredCity: existingPrefs.preferredCity || '',
          maxDistanceKm: existingPrefs.maxDistanceKm ?? 50,
          acceptShipping: existingPrefs.acceptShipping ?? true,
          minConditionScore: existingPrefs.minConditionScore ?? 5
        })
      }
      setLoading(false)
    }
    loadUser()
  }, [router])

  const handleSave = async () => {
    if (!userId) return
    setSaving(true)

    const success = await saveUserMatchingPreferences(userId, {
      mySizeText: preferences.mySizeText || undefined,
      myGender: preferences.myGender || undefined,
      hasChildren: preferences.hasChildren,
      childrenInfo: preferences.childrenInfo,
      preferredCategories: preferences.preferredCategories,
      sizeTolerance: preferences.sizeTolerance,
      seekingToyAgeMin: preferences.seekingToyAgeMin,
      seekingToyAgeMax: preferences.seekingToyAgeMax,
      preferredCity: preferences.preferredCity || undefined,
      maxDistanceKm: preferences.maxDistanceKm,
      acceptShipping: preferences.acceptShipping,
      minConditionScore: preferences.minConditionScore
    })

    setSaving(false)
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const toggleCategory = (cat: DbCategory) => {
    setPreferences(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(cat)
        ? prev.preferredCategories.filter(c => c !== cat)
        : [...prev.preferredCategories, cat]
    }))
  }

  const addChild = () => {
    setPreferences(prev => ({
      ...prev,
      childrenInfo: [...prev.childrenInfo, { age: 5, gender: 'boy' }]
    }))
  }

  const removeChild = (index: number) => {
    setPreferences(prev => ({
      ...prev,
      childrenInfo: prev.childrenInfo.filter((_, i) => i !== index)
    }))
  }

  const updateChild = (index: number, field: 'age' | 'gender', value: number | string) => {
    setPreferences(prev => ({
      ...prev,
      childrenInfo: prev.childrenInfo.map((child, i) => 
        i === index ? { ...child, [field]: value } : child
      )
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const Content = () => (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🎯 Akıllı Eşleştirme</h1>
        <p className="text-white/80">Tercihlerini belirle, sana uygun ürünleri öncelikli gör!</p>
      </div>

      {/* Kendi Beden Bilgilerin */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-pink-500" />
          Kıyafet Bedenim
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Beden</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPreferences(prev => ({ ...prev, mySizeText: size }))}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    preferences.mySizeText === size
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-2">Cinsiyet</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreferences(prev => ({ ...prev, myGender: 'female' }))}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  preferences.myGender === 'female'
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👩 Kadın
              </button>
              <button
                type="button"
                onClick={() => setPreferences(prev => ({ ...prev, myGender: 'male' }))}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  preferences.myGender === 'male'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👨 Erkek
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm text-gray-600 mb-2">
            Beden Toleransı: ±{preferences.sizeTolerance} beden kabul
          </label>
          <input
            type="range"
            min="0"
            max="2"
            value={preferences.sizeTolerance}
            onChange={(e) => setPreferences(prev => ({ ...prev, sizeTolerance: parseInt(e.target.value) }))}
            className="w-full accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Sadece tam</span>
            <span>±1 beden</span>
            <span>±2 beden</span>
          </div>
        </div>
      </div>

      {/* Çocuk Bilgileri */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Baby className="w-5 h-5 text-purple-500" />
          Çocuk Bilgileri (Oyuncak eşleştirmesi için)
        </h2>
        
        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={preferences.hasChildren}
            onChange={(e) => setPreferences(prev => ({ ...prev, hasChildren: e.target.checked }))}
            className="w-5 h-5 text-purple-500 rounded"
          />
          <span className="text-gray-700">Çocuğum var</span>
        </label>

        {preferences.hasChildren && (
          <div className="space-y-3">
            {preferences.childrenInfo.map((child, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <select
                  value={child.age}
                  onChange={(e) => updateChild(index, 'age', parseInt(e.target.value))}
                  className="px-3 py-2 rounded-lg border border-purple-200 bg-white"
                >
                  {Array.from({ length: 18 }, (_, i) => (
                    <option key={i} value={i}>{i} yaş</option>
                  ))}
                </select>
                <select
                  value={child.gender}
                  onChange={(e) => updateChild(index, 'gender', e.target.value)}
                  className="px-3 py-2 rounded-lg border border-purple-200 bg-white"
                >
                  <option value="boy">👦 Erkek</option>
                  <option value="girl">👧 Kız</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded-lg"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addChild}
              className="w-full py-2 border-2 border-dashed border-purple-300 text-purple-600 rounded-xl hover:bg-purple-50"
            >
              + Çocuk Ekle
            </button>
          </div>
        )}
      </div>

      {/* Tercih Edilen Kategoriler */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          🏷️ İlgilendiğim Kategoriler
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {categories.map(cat => (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggleCategory(cat.value)}
              className={`py-3 px-4 rounded-xl font-medium transition-all ${
                preferences.preferredCategories.includes(cat.value)
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lokasyon Tercihi */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-green-500" />
          Lokasyon Tercihi
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Tercih Edilen Şehir</label>
            <select
              value={preferences.preferredCity}
              onChange={(e) => setPreferences(prev => ({ ...prev, preferredCity: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Tümü</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={preferences.acceptShipping}
              onChange={(e) => setPreferences(prev => ({ ...prev, acceptShipping: e.target.checked }))}
              className="w-5 h-5 text-green-500 rounded"
            />
            <span className="text-gray-700">Kargo ile gönderim kabul ediyorum</span>
          </label>
        </div>
      </div>

      {/* Minimum Durum */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          ⭐ Minimum Ürün Durumu
        </h2>
        <input
          type="range"
          min="1"
          max="10"
          value={preferences.minConditionScore}
          onChange={(e) => setPreferences(prev => ({ ...prev, minConditionScore: parseInt(e.target.value) }))}
          className="w-full accent-pink-500"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Her durum</span>
          <span className="font-bold text-pink-600">{preferences.minConditionScore}/10</span>
          <span>Sadece mükemmel</span>
        </div>
      </div>

      {/* Kaydet Butonu */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
          saved 
            ? 'bg-green-500' 
            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90'
        }`}
      >
        {saving ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : saved ? (
          <>
            <Check className="w-5 h-5" />
            Kaydedildi!
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Tercihleri Kaydet
          </>
        )}
      </button>
    </div>
  )

  if (!isMobile) {
    return (
      <DesktopLayout title="Eşleştirme Tercihleri" maxWidth="2xl">
        <Content />
      </DesktopLayout>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Eşleştirme Tercihleri</h1>
      </div>

      <div className="p-4 pb-24">
        <Content />
      </div>
    </div>
  )
}
