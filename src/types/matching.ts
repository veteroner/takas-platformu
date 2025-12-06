import type { Item } from './types'

export type DbCategory = 'clothing' | 'toys' | 'electronics' | 'books' | 'sports' | 'home' | 'other'

export type ClothingSizeEU = '32'|'34'|'36'|'38'|'40'|'42'|'44'|'46'|'48'|'50'
export type ClothingSizeText = 'XS'|'S'|'M'|'L'|'XL'|'XXL'

// Yeni tipler - Akıllı Eşleştirme
export type GenderType = 'male' | 'female' | 'unisex' | 'kids_boy' | 'kids_girl' | 'baby'
export type AgeGroup = 'baby' | 'toddler' | 'kids' | 'teen' | 'adult'
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all_season'
export type Style = 'casual' | 'sport' | 'elegant' | 'vintage' | 'streetwear' | 'classic'
export type ToyType = 'educational' | 'activity' | 'plush' | 'building' | 'electronic' | 'outdoor' | 'puzzle' | 'board_game' | 'vehicle' | 'doll' | 'action_figure'
export type ToyGender = 'boys' | 'girls' | 'unisex'
export type BookAgeGroup = 'children' | 'young_adult' | 'adult'

// Ürün özellikleri (DB: item_attributes)
export interface ItemAttributes {
  id: string
  itemId: string
  sizeEu?: ClothingSizeEU
  sizeText?: ClothingSizeText
  gender?: GenderType
  ageGroup?: AgeGroup
  season?: Season
  style?: Style
  color?: string
  brand?: string
  toyAgeMin?: number
  toyAgeMax?: number
  toyType?: ToyType
  toyGender?: ToyGender
  bookGenre?: string
  bookLanguage?: string
  bookAgeGroup?: BookAgeGroup
  conditionScore?: number
}

// Çocuk bilgisi
export interface ChildInfo {
  age: number
  gender: 'boy' | 'girl'
}

// Kullanıcı eşleştirme tercihleri (DB: user_matching_preferences)
export interface UserMatchingPreferences {
  userId: string
  mySizeText?: ClothingSizeText
  myGender?: 'male' | 'female'
  hasChildren: boolean
  childrenInfo: ChildInfo[]
  preferredCategories: DbCategory[]
  sizeTolerance: number
  seekingToyAgeMin?: number
  seekingToyAgeMax?: number
  preferredCity?: string
  maxDistanceKm: number
  acceptShipping: boolean
  minConditionScore: number
}

// Eşleşme skoru
export interface MatchScore {
  categoryScore: number    // 0-25
  sizeScore: number        // 0-25
  ageScore: number         // 0-15
  conditionScore: number   // 0-15
  locationScore: number    // 0-10
  totalScore: number       // 0-100
}

// Zenginleştirilmiş item (feed için)
export interface EnrichedItem extends Item {
  matchScore?: number
  sizeMatch?: boolean
  ageMatch?: boolean
}

// Beden sabitleri
export const SIZE_ORDER: ClothingSizeText[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

// Yaş aralıkları
export const TOY_AGE_RANGES = {
  baby: { min: 0, max: 1, label: '0-1 yaş (Bebek)' },
  toddler: { min: 1, max: 3, label: '1-3 yaş' },
  preschool: { min: 3, max: 5, label: '3-5 yaş' },
  kids: { min: 5, max: 8, label: '5-8 yaş' },
  tween: { min: 8, max: 12, label: '8-12 yaş' },
  teen: { min: 12, max: 18, label: '12+ yaş' },
}

export interface ClothingFilter {
  sizeEU?: ClothingSizeEU
  sizeText?: ClothingSizeText
  color?: string[]
  brand?: string[]
  length?: 'short' | 'midi' | 'long'
  userHeightCm?: number
}

export interface ToyFilter {
  ageMin?: number
  ageMax?: number
  brand?: string[]
  category?: string[]
}

export interface BookFilter {
  language?: string[]
  genre?: string[]
  author?: string[]
}

export interface GameFilter {
  platform?: Array<'PS'|'Xbox'|'Nintendo'|'PC'>
  genre?: string[]
}

export interface ElectronicsFilter {
  brand?: string[]
  working?: boolean
  warranty?: boolean
}

export interface SeekingPreferences {
  categories: DbCategory[]
  valueMin?: number
  valueMax?: number
  locationCity?: string
  filters?: {
    clothing?: ClothingFilter
    toys?: ToyFilter
    books?: BookFilter
    electronics?: ElectronicsFilter
    games?: GameFilter
  }
}

export type PackageSuggestion = {
  items: Item[]
  total: number
  delta: number
}
