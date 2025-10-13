import type { Item } from '@/types'
import type { SeekingPreferences, PackageSuggestion } from '@/types'

// Normalize size strings like "M", "38", "L" into EU-ish scale for rough comparison
const sizeMap: Record<string, number> = {
  XS: 34, S: 36, M: 38, L: 40, XL: 42, XXL: 44
}

const normSize = (s?: string): number | undefined => {
  if (!s) return undefined
  const up = s.toUpperCase()
  if (sizeMap[up] != null) return sizeMap[up]
  const n = Number(up.replace(/[^0-9]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : undefined
}

const withinRange = (v: number, min?: number, max?: number) => {
  if (min != null && v < min) return false
  if (max != null && v > max) return false
  return true
}

const cityPenalty = (itemCity?: string, prefCity?: string) => {
  if (!prefCity || !itemCity) return 0
  return itemCity.toLowerCase() === prefCity.toLowerCase() ? 0 : 0.15
}

type DbCategory = 'clothing' | 'toys' | 'electronics' | 'books' | 'sports' | 'home' | 'other'

function toDbCategory(cat: any): DbCategory | undefined {
  if (!cat) return undefined
  const s = String(cat).toLowerCase()
  const dbs = ['clothing','toys','electronics','books','sports','home','other'] as const
  if ((dbs as readonly string[]).includes(s)) return s as DbCategory
  if (s.startsWith('clothing_') || s === 'accessories' || s === 'shoes') return 'clothing'
  if (s.startsWith('toys')) return 'toys'
  if (s === 'books') return 'books'
  if (s === 'electronics') return 'electronics'
  return undefined
}

export function scoreItem(item: Item, pref: SeekingPreferences): number {
  const dbCat = toDbCategory((item as any).category)
  if (!dbCat || !pref.categories.includes(dbCat)) return 0

  // Value window check using estimatedValue
  if (!withinRange(item.estimatedValue ?? 0, pref.valueMin, pref.valueMax)) return 0.1

  let catScore = 0.7 // default base

  switch (dbCat) {
    case 'clothing': {
      const f = pref.filters?.clothing
      if (f) {
        const itemSize = normSize(item.size)
        const wantedSize = normSize(f.sizeEU || f.sizeText)
        const sizeScore = itemSize && wantedSize
          ? Math.max(0.2, 1 - Math.min(8, Math.abs(itemSize - wantedSize)) / 8)
          : 0.7
        const colorScore = f.color && f.color.length
          ? (item.color || []).some(c => f.color!.some(fc => fc.toLowerCase() === c.toLowerCase())) ? 1 : 0.5
          : 0.8
        const brandScore = f.brand && f.brand.length
          ? (item.brand ? f.brand.includes(item.brand) ? 1 : 0.6 : 0.6)
          : 0.8
        catScore = 0.5 * sizeScore + 0.3 * colorScore + 0.2 * brandScore
      }
      break
    }
  case 'toys': {
      const f = pref.filters?.toys
      if (f) {
        const ageScore = f.ageMin != null && f.ageMax != null
          ? 1 // age not stored on Item model yet; future: use attributes
          : 0.7
        const brandScore = f.brand && f.brand.length
          ? (item.brand ? f.brand.includes(item.brand) ? 1 : 0.6 : 0.6)
          : 0.8
        catScore = 0.7 * ageScore + 0.3 * brandScore
      }
      break
    }
  case 'books': {
      const f = pref.filters?.books
      if (f) {
        // approximate via tags/title/description
        const text = `${item.title} ${item.description} ${item.tags.join(' ')}`.toLowerCase()
        const langScore = f.language && f.language.length
          ? (f.language.some(l => text.includes(l.toLowerCase())) ? 1 : 0.6)
          : 0.8
        const genreScore = f.genre && f.genre.length
          ? (f.genre.some(g => text.includes(g.toLowerCase())) ? 1 : 0.6)
          : 0.8
        catScore = 0.5 * langScore + 0.5 * genreScore
      }
      break
    }
  case 'electronics': {
      const f = pref.filters?.electronics
      if (f) {
        const brandScore = f.brand && f.brand.length
          ? (item.brand ? f.brand.includes(item.brand) ? 1 : 0.6 : 0.6)
          : 0.8
        catScore = brandScore
      }
      break
    }
    default:
      catScore = 0.7
  }

  const locPen = cityPenalty(item.location?.city, pref.locationCity)
  const score = (0.5 * 1 + 0.4 * catScore + 0.1) * (1 - locPen)
  return Math.round(score * 100)
}

export function filterAndRank(items: Item[], pref: SeekingPreferences, minScore = 60) {
  const scored = items.map(i => ({ item: i, score: scoreItem(i, pref) }))
  return scored
    .filter(s => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
}

export function suggestPackages(
  offeringValue: number,
  pool: Item[],
  tolerance = 0.1
): PackageSuggestion[] {
  const targetMin = offeringValue * (1 - tolerance)
  const targetMax = offeringValue * (1 + tolerance)
  const sorted = [...pool].sort((a, b) => (a.estimatedValue ?? 0) - (b.estimatedValue ?? 0))
  const results: PackageSuggestion[] = []

  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i]
    const v1 = a.estimatedValue ?? 0
    if (v1 >= targetMin && v1 <= targetMax) {
      results.push({ items: [a], total: v1, delta: Math.abs(offeringValue - v1) })
    }
    for (let j = i + 1; j < sorted.length; j++) {
      const b = sorted[j]
      const v2 = v1 + (b.estimatedValue ?? 0)
      if (v2 >= targetMin && v2 <= targetMax) {
        results.push({ items: [a, b], total: v2, delta: Math.abs(offeringValue - v2) })
      }
    }
  }

  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      let base = (sorted[i].estimatedValue ?? 0) + (sorted[j].estimatedValue ?? 0)
      if (base > targetMax) break
      let bestK = -1
      let bestDelta = Number.POSITIVE_INFINITY
      for (let k = j + 1; k < sorted.length; k++) {
        const v3 = base + (sorted[k].estimatedValue ?? 0)
        const delta = Math.abs(offeringValue - v3)
        if (v3 >= targetMin && v3 <= targetMax && delta < bestDelta) {
          bestDelta = delta
          bestK = k
        }
      }
      if (bestK !== -1) {
        const v3 = base + (sorted[bestK].estimatedValue ?? 0)
        results.push({ items: [sorted[i], sorted[j], sorted[bestK]], total: v3, delta: Math.abs(offeringValue - v3) })
      }
    }
  }

  return results.sort((a, b) => a.delta - b.delta).slice(0, 5)
}
