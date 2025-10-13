import type { Item } from './types'

export type DbCategory = 'clothing' | 'toys' | 'electronics' | 'books' | 'sports' | 'home' | 'other'

export type ClothingSizeEU = '32'|'34'|'36'|'38'|'40'|'42'|'44'|'46'|'48'|'50'
export type ClothingSizeText = 'XS'|'S'|'M'|'L'|'XL'|'XXL'

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
